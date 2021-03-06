import React from 'react';
import { mount } from 'enzyme';
import { register, wire, invalidate, clear } from '../../src';

class DumpComponent extends React.Component {
  render() {
    return <p>{ this.props.getText() }</p>;
  }
}
var Foo, Bar;

function renderComponent(Component, props = {}) {
  return mount(<Component { ...props } />);
}

describe('Given the wire and register helpers', function () {
  beforeEach(function () {
    clear();
    Foo = {
      word: 'Hey',
      getText: function () { return this.word; }
    };
  });

  describe('when we register dependency and wire a component to it', function () {
    it('should receive valid props when invalidate', function () {
      register({ Foo });

      const component = renderComponent(wire(
        DumpComponent,
        ['Foo'],
        foo => ({ getText: foo.getText.bind(foo) })
      ));

      expect(component.text()).to.equal('Hey');

      Foo.word = 'Bye';
      invalidate();
      expect(component.text()).to.equal('Bye');
    });
  });
  describe('when we use two storages', function () {
    it('should keep the data in separate storages', function () {
      register({ Foo });
      register(
        {
          Foo: {
            word: 'Bye',
            getText: function () { return this.word; }
          },
        },
        'blah'
      );

      const componentA = renderComponent(wire(
        DumpComponent,
        ['Foo'],
        Foo => ({ getText: Foo.getText.bind(Foo) })
      ));
      const componentB = renderComponent(wire(
        DumpComponent,
        ['Foo'],
        Foo => ({ getText: Foo.getText.bind(Foo) }),
        'blah'
      ));

      expect(componentA.text()).to.equal('Hey');
      expect(componentB.text()).to.equal('Bye');

    });
  });
});
