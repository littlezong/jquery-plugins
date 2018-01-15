/**
 * 	pagination jq分页插件
 * 	@author littlezong
 * 	@url https://github.com/littlezong/jquery-plugins
 * 	@date 20170726
 */
;(function($){
	function Pagination($ele, options){
		this.$ele = $ele;
		this.options = $.extend({}, this.defaultOptions, options || {});
		this.init();
	}

	Pagination.prototype = {
		defaultOptions: {
			className: 'pagination',
			current: 1,
			pageSize: 10,
			total: 10,
			showTotal: false,
			showQuickJumper: false,
			onPageChange: function(current){}
		},

		init: function(){
			this.setPagination();
		},

		setPagination: function(index){
			var activeIndex = this.$ele.find('.pagination-item-active').text();
			var current = index || this.options.current;
			var list = this.initPagination(current);
			this.$ele.html($(list));
			for(var e in this.events){
				this[e]();
			}
			
			if(index && index != activeIndex) this.options.onPageChange(index);
		},

		initPagination: function(current){
			var pageSize = this.options.pageSize;
			var total = this.options.total;
			var pagination_items = Math.ceil(total / pageSize);
			if(current > pagination_items) current = 1;
			var list = '<ul class="' + this.options.className + '">' 
						+ (current == 1 ? '<li class="pagination-prev pagination-disabled"><a></a></li>' : '<li class="pagination-prev"><a></a></li>');

			for(var i = 1; i <= pagination_items; i++){
				var active = current == i ? 'pagination-item-active' : '';
				if(current < 4){
					if(i > 5){
						list += '<li class="pagination-jump-next"><a></a></li>'
								+ '<li title='
								+ pagination_items
								+ '" class="pagination-item pagination-item-'
								+ pagination_items
								+ '"><a>'
								+ pagination_items
								+ '</a></li>';
						break;
					}else{
						list += '<li title="' 
								+ i 
								+ '" class="pagination-item ' + active + ' pagination-item-' 
								+ i 
								+ '"><a>' 
								+ i 
								+ '</a></li>';
					}
				}else if(current == 4){
					if(i > 6){
						list += '<li class="pagination-jump-next"><a></a></li>'
								+ '<li title='
								+ pagination_items
								+ '" class="pagination-item pagination-item-'
								+ pagination_items
								+ '"><a>'
								+ pagination_items
								+ '</a></li>';
						break;
					}else{
						list += '<li title="' 
								+ i 
								+ '" class="pagination-item ' + active + ' pagination-item-' 
								+ i 
								+ '"><a>' 
								+ i 
								+ '</a></li>';
					}
				}else{
					if(pagination_items - current > 2){
						if(i == current - 2 || i == current - 1 || i == current || i == +current + 1 || i == +current + 2){
							list += '<li title="' 
									+ i 
									+ '" class="pagination-item ' + active + ' pagination-item-' 
									+ i 
									+ '"><a>' 
									+ i 
									+ '</a></li>';
						}
					}else{
						if(i >= pagination_items - 4 && i < pagination_items){
							list += '<li title="' 
									+ i 
									+ '" class="pagination-item ' + active + ' pagination-item-' 
									+ i 
									+ '"><a>' 
									+ i 
									+ '</a></li>';
						}
					}
					if(i == 1){
						list += '<li title="' 
								+ i 
								+ '" class="pagination-item pagination-item-' 
								+ i 
								+ '"><a>' 
								+ i 
								+ '</a></li>'
								+ '<li class="pagination-jump-prev"><a></a></li>';
					}else if(i == pagination_items){
						if(i - current >= 4){
							list += '<li class="pagination-jump-next"><a></a></li>'
									+ '<li title='
									+ pagination_items
									+ '" class="pagination-item pagination-item-'
									+ pagination_items
									+ '"><a>'
									+ pagination_items
									+ '</a></li>';
						}else{
							list += '<li title='
									+ pagination_items
									+ '" class="pagination-item ' + active + ' pagination-item-'
									+ pagination_items
									+ '"><a>'
									+ pagination_items
									+ '</a></li>';
						}
					}
				}
			}
			list = list + (current == pagination_items ? '<li class="pagination-next pagination-disabled"><a></a></li>' : '<li class="pagination-next"><a></a></li>') + '</ul>';

			return list;
		},

		events: {
			pageSelect: 'pageSelect',
			arrowChangePage: 'arrowChangePage',
			arrowJumpPage: 'arrowJumpPage',
			showTotal: 'showTotal',
			onQuickJump: 'onQuickJump'
		},

		pageSelect: function(){
			var self = this;
			this.$ele.find('.pagination-item').on('click', function(){
				self.setPagination($(this).text());
			});
		},

		arrowChangePage: function(){
			var self = this;
			self.$ele.find('.pagination-prev, .pagination-next').on('click', function(){
				if($(this).is('.pagination-disabled')) return;
				var current = self.$ele.find('.pagination-item-active').text();
				if($(this).is('.pagination-prev')){
					current--;
				}else{
					current++;
				}
				self.setPagination(current);
			});
		},

		arrowJumpPage: function(){
			var self = this;
			self.$ele.find('.pagination-jump-prev, .pagination-jump-next').on('click', function(){
				var pageSize = self.options.pageSize;
				var total = self.options.total;
				var pagination_items = Math.ceil(total / pageSize);
				var current = self.$ele.find('.pagination-item-active').text();
				if($(this).is('.pagination-jump-prev')){
					current = (current - 5 > 0) ? (current - 5) : 1;
				}else{
					current = (+current + 5 > pagination_items) ? pagination_items : (+current + 5);
				}

				self.setPagination(current);
			});
		},

		onQuickJump: function(){
			if(!this.options.showQuickJumper) return;
			var self = this;
			var jumper = '<li class="pagination-options">'
						+ '<div class="pagination-options-quick-jumper">'
						+ '跳转到' + '<input type="text" />' + '页'
						+ '</div>'
						+ '</li>';
			self.$ele.find('.pagination').append($(jumper));
			self.$ele.find('.pagination-options-quick-jumper input').on('keydown', function(e){
				if(e.which == 13){
					var current = $(this).val();
					if(current != ''){
						self.setPagination(current);
					}
				}
			});
		},

		showTotal: function(){
			if(!this.options.showTotal) return;
			var total = '<li class="pagination-total-text">'
						+ '共 ' + this.options.total + ' 条数据'
						+ '</li>';
			this.$ele.find('.pagination').prepend($(total));
		}
	}

	$.fn.pagination = function(options){
		return this.each(function(){
			new Pagination($(this), options);
		});
	}
})(jQuery)