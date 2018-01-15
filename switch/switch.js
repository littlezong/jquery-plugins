/**
 * 	pagination jq开关插件
 * 	@author littlezong
 * 	@url https://github.com/littlezong/jquery-plugins
 * 	@date 20170726
 */
;(function($){
	function Switch($ele, options){
		this.$ele = $ele;
		this.options = $.extend({}, this.defaultOptions, options || {});
		this.init();
	}

	Switch.prototype = {
		defaultOptions: {
			isCheck: true,												// 开关状态
			text: [],													// 文字显示
			callback: function(params){console.log(params)}				// 回调
		},

		init: function(){
			var check = this.options.isCheck;
			var text = this.getStatus(check);
			var inner = '<span class="z-switch-inner">' + text + '</span>';
			
			if(check){
				this.$ele.addClass('z-switch z-switch-checked').append($(inner));
			}else{
				this.$ele.addClass('z-switch').append($(inner));
			}

			this.toggle();
		},

		getStatus: function(isCheck){
			var options = this.options;
			if(options.text.length > 0){
				return isCheck ? (options.text[0] || '') : (options.text[1] || '');
			}else{
				return '';
			}
		},

		toggle: function(){
			var self = this;
			self.$ele.on('click', function(){
				var check = !$(this).is('.z-switch-checked');
				if(check){
					$(this).addClass('z-switch-checked');
				}else{
					$(this).removeClass('z-switch-checked');
				}
				var text = self.getStatus(check);
				self.$ele.find('.z-switch-inner').text(text);

				self.options.callback && self.options.callback(check);
			});
		}
	}

	$.fn.switch = function(options){
		return this.each(function(){
			new Switch($(this), options);
		});
	}
})(jQuery)