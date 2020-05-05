(function () {

    class Dialog {
        constructor(options) {
            //把传递进来的配置信息挂载在到实例上（以后可以基于这个实例，在各个方法中拿到这个信息）
            for (let key in options) {
                if (!options.hasOwnProperty(key)) break;
                //关于template
                if (key === 'template') {
                    let val = options[key];
                    if (typeof val === 'string') {
                        let p = document.createElement('p');
                        p.innerHTML = val;
                        options[key] = p;
                    }
                }
                this[key] = options[key];
            }

            this.init();
        }

        init() {
            if (this.status === 'message') {
                this.createMessage();
                this.open();

                return;
            }
        }
        //创建提示消息元素
        createMessage() {
            this.messageBox = document.createElement('div');
            this.messageBox.className = `dpn-message dpn-${this.type}`;
            this.messageBox.innerHTML = `
            ${this.message}
            <i class="dpn-close">X</i>
            `;
            document.body.appendChild(this.messageBox);

            this.messageBox.onclick = (ev)=>{
                let target = ev.target;
                if(target.className === 'dpn-close'){
                    this.close();
                }
            };

        }
        //创建dialog模板
        createDialog() {

        }
        //控制显示
        open() {
            if (this.status === 'message') {
                this.messageBox.offsetHeight;
                this.messageBox.style.top = '20px';

                this.autoTimer = setTimeout(() => {
                    this.close();
                }, this.durations);
                return;
            }

        }
        //控制隐藏
        close() {
            if (this.status === 'message') {
                clearTimeout(this.autoTimer);
                this.messageBox.style.top = '-200px';
                
                let anonymous = () => {
                    document.body.removeChild(this.messageBox);
                    this.messageBox.removeEventListener('animationend');
                };
                this.messageBox.addEventListener('animationend', anonymous);
            }

        }


    }

    let _anonymous = Function.prototype;
    window.messageplugin = function messageplugin(options = {}) {


        if (typeof options === 'string') {
            options = {
                message: options
            };
        }
        //参数初始化
        options = Object.assign({
            //message消息类型
            status: 'message',
            //提示文案的内容
            message: '',
            //消息展示的类型  info/warning/success/error
            type: 'info',
            //自动消失的时间，如果是零则不会消失
            durations: 3000,
            //钩子函数  创建、打开、关闭
            oninit: _anonymous,
            onopen: _anonymous,
            onclose: _anonymous

        }, options);
        return new Dialog(options);
    }


    window.dialogplugin = function dialogplugin(options = {}) {
        options = Object.assign({
            status: 'dialog',
            template: null,
            title: '系统提示',
            buttons: [],
            oninit: _anonymous,
            onopen: _anonymous,
            onclose: _anonymous
        }, options);
        return new Dialog(options);
    }
})()