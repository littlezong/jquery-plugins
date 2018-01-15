/**
 * 	pagination jq模态框插件
 * 	@author littlezong
 * 	@url https://github.com/littlezong/jquery-plugins
 * 	@date 20170726
 */
;(function($){
	function Modal($ele, options){
		this.$ele = $ele;
		this.options = $.extend({}, this.defaultOptions, options);
		this.init();
	}

	Modal.prototype = {
		defaultOptions: {
			title: 'Modal',			// 标题
			content: 'content', 	// 内容
			footer: 'default',				// 底部内容
			width: 520,				// 宽度
			maskClosable: true, 	// 点击蒙层是否允许关闭
			closable: true,			// 是否显示右上角关闭按钮
			okText: '确定',			// 确认按钮文字
			cancelText: '取消', 	// 取消按钮文字
			onOk: function(){
				console.log('ok');
			},						// 点击确定回调
			onCancel: function(){
				console.log('cancel');
			}  						// 点击取消回调
		},

		init: function(){
			// this.initModal();
			for(var action in this.actions){
				this[action]();
			}
		},

		actions: {
			initModal: 'initModal',
			handleEvent: 'handleEvent'
		},

		initModal: function(){
			var modalCloseX = this.options.closable ? '<button class="modal-close"><span class="modal-close-x">&Chi;</span></button>' : '';
			var title = this.options.title;
			var content = this.options.content;
			var width = this.options.width;
			var okText = this.options.okText;
			var cancelText = this.options.cancelText;
			var id = this.$ele[0].id;
			var footer = this.options.footer ? '<div class="modal-footer"><button type="button" class="btn"><span>' + cancelText + '</span></button><button type="button" class="btn btn-primary"><span>' + okText + '</span></button></div>' : '';
			var modal = '<div class="modal-pack" data-trigger="' + id + '">'
							+ '<div class="modal-mask modal-mask-hidden"></div>'
							+ '<div class="modal-wrap" style="display: none;">'
								+ '<div class="modal" style="width:' + width + 'px">'
									+ '<div class="modal-content">'
										+ modalCloseX
										+ '<div class="modal-header">'
											+ '<div class="modal-title">' + title + '</div>'
										+ '</div>'
										+ '<div class="modal-body">' + content + '</div>'
										+ footer
									+ '</div>'
								+ '</div>'
							+ '</div>'
						+ '</div>';
			$('body').append($(modal));
		},

		handleEvent: function(){
			var self = this;
			// 触发按钮
			self.$ele.on('click', function(){
				self.openModal($(this));
			});
			// 右上角x
			$('.modal-close').on('click', function(){
				self.closeModal($(this));
			});
			// 页脚按钮
			$('.modal-footer button').on('click', function(){
				if($(this).index() == 0){
					self.closeModal($(this), self.options.onCancel);
				}else{
					self.closeModal($(this), self.options.onOk);
				}
			});
			
			$('.modal-mask, .modal-wrap').on('click', function(){
				if(self.options.maskClosable){
					self.closeModal($(this));
				}
			});

			$('.modal').on('click', function(e){
				return false;
			});
		},

		closeModal: function(target, callback){
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			target.parents('.modal-pack').find('.modal-mask').addClass('modal-mask-hidden').next().children('.modal').addClass('zoom-leave zoom-leave-active').one(animationEnd, function(){
				$(this).removeClass('zoom-leave zoom-leave-active').parent().hide();
			});

			callback && callback();
		},

		openModal: function(target){
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			$('.modal-pack').each(function(){
				if($(this).data('trigger') == target.data('modal')){
					$(this).find('.modal-mask').removeClass('modal-mask-hidden').next().show().children('.modal').addClass('zoom-enter zoom-enter-active').one(animationEnd, function(){
						$(this).removeClass('zoom-enter zoom-enter-active');
					});
				}
			});
		}
	}

	$.fn.modal = function(options){
		return this.each(function(){
			new Modal($(this), options);
		});
	}
})(jQuery)