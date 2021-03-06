import numberFormats from './fixture/number'

const desc = VueI18n.availabilities.numberFormat ? describe : describe.skip
desc('number custom formatting', () => {
  let i18n
  let value

  beforeEach(() => {
    i18n = new VueI18n({
      locale: 'en-US',
      fallbackLocale: 'ja-JP',
      numberFormats
    })
    value = 10100
  })

  describe('basic', () => {
    it('should be formatted', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value } })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.textContent, '10,100')
      }).then(done)
    })
  })

  describe('format', () => {
    describe('as string property', () => {
      it('should be formatted', done => {
        const vm = new Vue({
          i18n,
          el: document.createElement('div'),
          render (h) {
            return h('i18n-n', { props: { value, format: 'currency' } })
          },
        })
        Vue.nextTick().then(() => {
          assert.strictEqual(vm.$el.textContent, '$10,100.00')
        }).then(done)
      })
    })

    describe('as object property', () => {
      it('should be formatted', done => {
        const vm = new Vue({
          i18n,
          el: document.createElement('div'),
          render (h) {
            return h('i18n-n', { props: { value, format: { key: 'currency' } } })
          },
        })
        Vue.nextTick().then(() => {
          assert.strictEqual(vm.$el.textContent, '$10,100.00')
        }).then(done)
      })
    })
  })

  describe('locale', () => {
    it('should be formatted', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value, format: 'currency', locale: 'ja-JP' } })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.textContent, '￥10,100')
      }).then(done)
    })
  })

  describe('tag', () => {
    it('should default to span', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value } })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.outerHTML, '<span>10,100</span>')
      }).then(done)
    })

    it('should be formatted', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value, tag: 'p' } })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.outerHTML, '<p>10,100</p>')
      }).then(done)
    })

    it('of value true defaults to span', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value, tag: true } })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.outerHTML, '<span>10,100</span>')
      }).then(done)
    })

    it('of value false does not apply a root container', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value, tag: false } })
        },
      })
      Vue.nextTick().then(() => {
        console.log('\n\n\n\n\n\n\n', vm.$el, '\n\n', vm.$el.nodeType)
        assert.strictEqual(vm.$el.nodeType, Node.TEXT_NODE)
        assert.strictEqual(vm.$el.data, '10,100')
      }).then(done)
    })
  })

  describe('explicit options', () => {
    describe('without key', () => {
      it('should be formatted', done => {
        const vm = new Vue({
          i18n,
          el: document.createElement('div'),
          render (h) {
            return h('i18n-n', { props: { value, format: { style: 'currency', currency: 'JPY' } } })
          },
        })
        Vue.nextTick().then(() => {
          assert.strictEqual(vm.$el.textContent, '¥10,100')
        }).then(done)
      })

      it('should respect other number options', done => {
        const vm = new Vue({
          i18n,
          el: document.createElement('div'),
          render (h) {
            return h('i18n-n', { props: { value, format: { style: 'currency', currency: 'EUR', currencyDisplay: 'code' } } })
          },
        })
        Vue.nextTick().then(() => {
          assert.strictEqual(vm.$el.textContent, 'EUR 10,100.00')
        }).then(done)
      })
    })

    describe('with key', () => {
      it('should be formatted', done => {
        const vm = new Vue({
          i18n,
          el: document.createElement('div'),
          render (h) {
            return h('i18n-n', { props: { value, format: { key: 'currency', currency: 'JPY' } } })
          },
        })
        Vue.nextTick().then(() => {
          assert.strictEqual(vm.$el.textContent, '¥10,100')
        }).then(done)
      })

      it('should respect other number options', done => {
        const vm = new Vue({
          i18n,
          el: document.createElement('div'),
          render (h) {
            return h('i18n-n', { props: { value, format: { key: 'currency', currency: 'EUR', currencyDisplay: 'code' } } })
          },
        })
        Vue.nextTick().then(() => {
          assert.strictEqual(vm.$el.textContent, 'EUR 10,100.00')
        }).then(done)
      })
    })
  })

  describe('partial formatting', () => {
    it('should be formatted', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', {
            props: { value },
            scopedSlots: {
              integer: props => h('span', props.integer),
              group: props => h('p', props.group)
            }
          })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.innerHTML, '<span>10</span><p>,</p><span>100</span>')
      }).then(done)
    })

    it('should pass part index as scoped prop', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', {
            props: { value: 1000000, format: 'currency' },
            scopedSlots: {
              currency: props => h('span', new Array(3).fill(props.currency).join('')),
              group: props => h('p', { staticClass: props.index }, props.group)
            }
          })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.innerHTML, '<span>$$$</span>1<p class="2">,</p>000<p class="4">,</p>000.00')
      }).then(done)
    })

    it('should pass parts as scoped prop', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', {
            props: { value: -12 },
            scopedSlots: {
              integer: props => h('span', {
                staticClass: props.parts.find(part => part.type === 'minusSign') ? 'red' : ''
              }, props.integer)
            }
          })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.innerHTML, '-<span class="red">12</span>')
      }).then(done)
    })

    it('should ignore non-present scoped slot', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', {
            props: { value },
            scopedSlots: {
              currency: props => h('span', props.currency)
            }
          })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.innerHTML, '10,100')
      }).then(done)
    })

    it('should ignore default scoped slot', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', {
            props: { value },
            scopedSlots: {
              default: props => h('span', props.integer)
            }
          })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.innerHTML, '10,100')
      }).then(done)
    })
  })

  describe('fallback', () => {
    it('should be formatted', done => {
      const vm = new Vue({
        i18n,
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value: 0.9, format: 'percent' } })
        },
      })
      Vue.nextTick().then(() => {
        assert.strictEqual(vm.$el.textContent, '90%')
      }).then(done)
    })
  })

  describe('change number format runtime', () => {
    it('should be changed', done => {
      const i18n = new VueI18n({
        locale: 'en-US',
        numberFormats
      })
      const el = document.createElement('div')
      document.body.appendChild(el)

      const money = 101
      const vm = new Vue({
        i18n,
        render (h) {
          return h('p', { ref: 'text' }, [this.$n(money, 'currency')])
        }
      }).$mount(el)

      const { text } = vm.$refs
      const otherEnFormat = {
        currency: {
          style: 'currency', currency: 'CZK', currencyDisplay: 'name'
        }
      }

      Vue.nextTick().then(() => {
        assert.strictEqual(text.textContent, '$101.00')
        i18n.setNumberFormat('en-US', otherEnFormat)
      }).then(() => {
        assert.strictEqual(text.textContent, '101.00 Czech korunas')
      }).then(done)
    })
  })

  describe('warnning in render', () => {
    it('should be warned', () => {
      const spy = sinon.spy(console, 'warn')

      new Vue({
        el: document.createElement('div'),
        render (h) {
          return h('i18n-n', { props: { value } })
        },
      })
      assert(spy.notCalled === false)
      assert(spy.callCount === 1)

      spy.restore()
    })
  })
})
