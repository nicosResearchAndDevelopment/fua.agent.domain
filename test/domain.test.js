const
  { describe, test, before } = require('mocha'),
  expect = require('expect'),
  { DataFactory } = require('@fua/module.persistence'),
  InmemoryStore = require('@fua/module.persistence.inmemory'),
  Space = require('@fua/agent.space'),
  Domain = require('../src/domain.js');

describe('agent.domain', function () {

  test('basic usage', async function () {
    await Space.initialize({
      context: {
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'fua': 'https://www.nicos-rd.com.org/fua#',
        'dom': 'http://www.nicos-rd.com/fua/domain#'
      },
      store: {
        module: 'inmemory'
      }
    });

    const { store, factory } = Space;
    store.dataset.add(factory.quad(
      factory.namedNode('http://localhost/domain/'),
      factory.namedNode('rdf:type'),
      factory.namedNode('dom:Domain')
    ));
    store.dataset.add(factory.quad(
      factory.namedNode('http://localhost/domain/users/'),
      factory.namedNode('rdf:type'),
      factory.namedNode('dom:Users')
    ));
    store.dataset.add(factory.quad(
      factory.namedNode('http://localhost/domain/'),
      factory.namedNode('dom:users'),
      factory.namedNode('http://localhost/domain/users/')
    ));
    store.dataset.add(factory.quad(
      factory.namedNode('http://localhost/domain/groups/'),
      factory.namedNode('rdf:type'),
      factory.namedNode('dom:Groups')
    ));
    store.dataset.add(factory.quad(
      factory.namedNode('http://localhost/domain/'),
      factory.namedNode('dom:groups'),
      factory.namedNode('http://localhost/domain/groups/')
    ));
    store.dataset.add(factory.quad(
      factory.namedNode('http://localhost/domain/users/spetrac/'),
      factory.namedNode('rdf:type'),
      factory.namedNode('fua:User')
    ));
    store.dataset.add(factory.quad(
      factory.namedNode('http://localhost/domain/users/'),
      factory.namedNode('ldp:member'),
      factory.namedNode('http://localhost/domain/users/spetrac/')
    ));

    await Domain.initialize({
      uri: 'http://localhost/domain/'
    });

    const usersArr = await Domain.getAllUsers();
    expect(usersArr).toHaveLength(1);
    expect(usersArr[0].id).toBe('http://localhost/domain/users/spetrac/');
  });

});
