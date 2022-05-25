const
    {describe, test, before} = require('mocha'),
    expect                   = require('expect'),
    fetch                    = require('node-fetch'),
    {DataFactory}            = require('@nrd/fua.module.persistence'),
    InmemoryStore            = require('@nrd/fua.module.persistence.inmemory'),
    {Space}                  = require('@nrd/fua.module.space'),
    DomainAgent              = require('../src/agent.domain.js');

describe('agent.domain', function () {

    test('basic usage', async function () {
        const
            factory     = new DataFactory({
                'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                'fua': 'https://www.nicos-rd.com.org/fua#',
                'dom': 'http://www.nicos-rd.com/fua/domain#'
            }),
            store       = new InmemoryStore(null, factory),
            space       = new Space({store}),
            agent       = new DomainAgent({
                uri: 'http://localhost/domain/'
            }),
            serverQuads = [
                factory.quad(
                    factory.namedNode('http://localhost/domain/'),
                    factory.namedNode('rdf:type'),
                    factory.namedNode('dom:Domain')
                ),
                factory.quad(
                    factory.namedNode('http://localhost/domain/users/'),
                    factory.namedNode('rdf:type'),
                    factory.namedNode('dom:Users')
                ),
                factory.quad(
                    factory.namedNode('http://localhost/domain/'),
                    factory.namedNode('dom:users'),
                    factory.namedNode('http://localhost/domain/users/')
                ),
                factory.quad(
                    factory.namedNode('http://localhost/domain/groups/'),
                    factory.namedNode('rdf:type'),
                    factory.namedNode('dom:Groups')
                ),
                factory.quad(
                    factory.namedNode('http://localhost/domain/'),
                    factory.namedNode('dom:groups'),
                    factory.namedNode('http://localhost/domain/groups/')
                ),
                factory.quad(
                    factory.namedNode('http://localhost/domain/users/spetrac/'),
                    factory.namedNode('rdf:type'),
                    factory.namedNode('fua:User')
                ),
                factory.quad(
                    factory.namedNode('http://localhost/domain/users/'),
                    factory.namedNode('ldp:member'),
                    factory.namedNode('http://localhost/domain/users/spetrac/')
                )
            ],
            initOptions = {
                space
            };

        serverQuads.forEach(serverQuad => store.dataset.add(serverQuad));
        await agent.initialize(initOptions);
        const usersArr = await agent.getAllUsers();
        expect(usersArr).toHaveLength(1);
        expect(usersArr[0].id).toBe('http://localhost/domain/users/spetrac/');
    });

});
