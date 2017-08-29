import Vue from 'vue'
import Hello from '../../../src/components/Hello.vue'
import App from '../../../src/App.vue'
import router from "../../../src/router";

describe('Hello.vue', () => {

  App.router = router;
  const AppConstructor = Vue.extend(App);
  const AppVM = new AppConstructor().$mount();

  const HelloConstructor = Vue.extend(Hello);
  const HelloVm = new HelloConstructor().$mount();

  it("App.vue 에 msg이 '테스트 개어렵네' 여야 한다 있어야 한다.", () => {
    expect(AppVM.$el.querySelector('#app p').textContent).to.equal("테스트 개어렵네");
  });

  it("App.vue 에 .canvas 가 있어야 한다.", () => {
    console.log(AppVM.$el.querySelector('#app .canvas'));
    expect(AppVM.$el.querySelector('#app .canvas')).to.not.equal(null);
  });

  it("App.vue 에 .canvas 안에 뷰 이미지가 있어야 한다.", () => {
    expect(AppVM.$el.querySelector('#app .canvas img')).to.not.equal(null);
  });

  it("이미지 속성에 draggable 있어야 한다.", () => {
    expect(AppVM.$el.querySelector('#app .canvas img').hasAttribute("draggable")).to.equal(true);
  });

  it("이미지 속성에 @dragstart 있어야 한다.", () => {
    expect(AppVM.$el.querySelector('#app .canvas img').hasAttribute("@dragstart")).to.equal(true);
  });

  it('should render correct contents', () => {

    expect(HelloVm.$el.querySelector('.hello h1').textContent).to.equal('Welcome to Your Vue.js App');
  });
});
