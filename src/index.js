import chimee from 'chimee';
import chimeeControl from 'chimee-plugin-controlbar';
import chimeePopup from 'chimee-plugin-popup';
import './ui.css';

chimee.install(chimeeControl);

chimee.install(chimeePopup({
  name: 'chimeeCenterState',
  tagName: 'chimee-center-state',
  html: `
    <chimee-center-state-correct>
      <chimee-center-state-loading></chimee-center-state-loading>
      <chimee-center-state-tip>
        <span></span>
      </chimee-center-state-tip>
    </chimee-center-state-correct>
    <chimee-center-state-error>加载失败，请刷新重试</chimee-center-state-error>
  `,
  offset: '50%',
  hide: false,
  create () {},
  penetrate: true,
  operable: false,
  destroy () {
    this.clearTimeout();
  },
  events: {
    pause () {
      this.showTip('play');
      this.showLoading(false);
    },
    play () {
      this.showTip('pause');
    },
    canplay () {
      this.playing();
    },
    playing () {
      this.playing();
    },
    waiting () {
      this.waiting();
    },
    // 卡顿(FLV|HLS加载异常待内部特供事件)
    // stalled () {
    //   this.showLoading();
    // },
    timeupdate () {
      this.clearTimeout();
    },
    c_mousemove () {
      !this.paused && this.showTip('pause');
    }
  },
  methods: {
    playing () {
      this.clearTimeout();
      this.showLoading(false);
      this.showError(false);
    },
    waiting () {
      this.clearTimeout();
      // 加载超过20秒则超时显示异常
      this._timeout = setTimeout(() => this.showError(), 3e4);
      !this.paused && this.showLoading();
    },
    clearTimeout () {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    },
    showTip (cls) {
      const clss = 'correct tip play pause';
      this.$domWrap.removeClass(clss).addClass('correct tip ' + cls);
      clearTimeout(this.tipId);
      if(cls === 'pause') {
        this.tipId = setTimeout(() => {
          this.$domWrap.removeClass('correct tip ' + cls);
        }, 2000)
      }
    },
    showLoading (status) {
      if(status === false) {
        this.$domWrap.removeClass('loading');
      }else{
        this.$domWrap.addClass('correct loading');
      }
    },
    showError (status) {
      if(status === false) {
        this.$domWrap.removeClass('error');
      }else{
        this.$domWrap[0].className = '';
        this.$domWrap.addClass('error');
      }
    }
  }
}));

export default function generateVideo(config) {
  return new chimee(config)
}

