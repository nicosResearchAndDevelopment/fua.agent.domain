const
    domain_model_preferredPrefix = "dom:"
;

//region error

class ErrorDomainIdIsMissing extends Error {
    constructor(message) {
        super(`[${timestamp()}] : fua.agent.Domain : Domain :: ${message}`);
    }
}

//endregion error

//region fn

function timestamp() {
    return (new Date).toISOString();
}

//endregion fn

function Domain({
                    'config': config,
                    'amec':   amec = undefined
                }) {

    const
        id     = config['@id'],
        Users  = config['dom:users'][0],
        Groups = config['dom:groups'][0],
        space  = config.space
    ;

    let
        domain     = {},
        tmp_node   = undefined,
        tmp_prefix = undefined
    ;

    if (new.target) {
        if (!id)
            throw new ErrorDomainIdIsMissing("id is missing");
        Object.defineProperties(domain, {
            'id': {
                value:      id,
                enumerable: true
            }
            //region domain.users
            ,
            'users': {
                value:
                              Object.defineProperties(async () => {
                                  await Users.read();
                                  return Users['ldp:member'];
                              }, {
                                  'id':  {value: `${id}users`},
                                  'get': {
                                      value:         async (id) => {
                                      //value:         async (node) => {
                                      //value:         async (predicate, value) => {

                                          let
                                              filter_properties = Object.entries(node)
                                          ;
                                          //let user_ = {};
                                          await Users.read();

                                          //space.on('change', 1000, Users['@id'], async (data) => {
                                          //    if (data)
                                          //        await Users.read();
                                          //    Users_map = ...;
                                          //});

                                          id = space.factory.namedNode(id).value;

                                          let
                                              user = Users['ldp:member'].find((node) => {
                                                  //for(let [key, value] of filter_properties) {
                                                  //
                                                  //} // for
                                                  return (node['@id'] === id);
                                              })
                                          ;
                                          if (!user || !await user.read())
                                              throw new Error(``);

                                          //user_['@id'] = user['@id'];
                                          return user;
                                          //return user_;

                                      }, enumerable: false
                                  },
                                  'has': {
                                      value:         async (id) => {
                                          id       = ((typeof id === "string") ? id : id['@id']);
                                          let
                                              user = space.getNode(id)
                                          ;
                                          if (!await user.read())
                                              return false;
                                          return true;
                                      }, enumerable: false
                                  }
                              }) // Object.defineProperties()
                , enumerable: true
            }, // users
            'user':  {
                value:
                              Object.defineProperties({}, {
                                  'memberOf': {
                                      value:         async (user, group) => {
                                          return await domain.group.hasMember(group, user);
                                      }, enumerable: false
                                  } // memberOf
                              }) // Object.defineProperties()
                , enumerable: true
            } // user
            //'user_has_group': {
            //  value: (user_id, group_id) => {}, enumerable: false
            //}
            //endregion domain.users
            //region domain.groups
            ,
            'groups': {
                value:
                              Object.defineProperties(async () => {
                                  await Groups.read();
                                  return Groups['ldp:member'];
                              }, {
                                  'id':  {value: `${id}groups`},
                                  'get': {
                                      value:         async (id) => {

                                          //let user_ = {};
                                          await Groups.read();

                                          //space.on('change', 1000, Users['@id'], async (data) => {
                                          //    if (data)
                                          //        await Users.read();
                                          //    Users_map = ...;
                                          //});

                                          id = space.factory.namedNode(id).value;

                                          let
                                              group = Groups['ldp:member'].find((node) => {
                                                  return (node['@id'] === id);
                                              })
                                          ;
                                          if (!group || !await group.read())
                                              // TODO : better error...
                                              throw new Error(``);

                                          return group;
                                      }, enumerable: false
                                  },
                                  'has': {
                                      value:         async (id) => {
                                          id        = ((typeof id === "string") ? id : id['@id']);
                                          let
                                              group = space.getNode(id)
                                          ;
                                          if (!await group.read())
                                              return false;
                                          return true;
                                      }, enumerable: false
                                  }
                              }) // Object.defineProperties()
                , enumerable: true
            }, // groups
            'group':  {
                value:
                              Object.defineProperties({}, {
                                  'hasMember': {
                                      value:         async (group, member) => {
                                          let result = false;
                                          group      = ((typeof group === "string") ? group : group['@id']);
                                          member     = ((typeof member === "string") ? member : member['@id']);
                                          group      = await domain.groups.get(group);
                                          result     = group['ldp:member'].find((entry) => {
                                              return (entry['@id'] === member);
                                          });
                                          return !!result;
                                      }, enumerable: false
                                  } // hasMember
                              }) // Object.defineProperties()
                , enumerable: true
            } // groups
            //endregion domain.groups
        }); // Object.defineProperties()

        if (amec)
            Object.defineProperty(domain, 'authenticate', {
                value:         async (credentials, mechanism) => {
                    return await amec['authenticate'](credentials, mechanism, domain.users);
                }, enumerable: false
            });

    } // if ()

    //tmp_prefix = (contextHasPrefix({'context': Domain['@context'], 'prefix': "owner"}) ? "" : "system:");
    //Object.defineProperties(fn, {
    //    [`${tmp_prefix}owner`]: {
    //        value:      async () => {
    //            return {
    //                '@id':   ((typeof node['owner'] === "string") ? node['owner'] : (node['owner']['@id'] || null)),
    //                '@type': "foaf:Agent"
    //            };
    //        },
    //        enumerable: true
    //    }
    //}); // Object.defineProperties()

    //tmp_node = (node['users'] || node[`${domain_model_preferredPrefix}users`]);
    //if (tmp_node) {
    //    tmp_prefix = (contextHasPrefix({
    //        'context': Domain['@context'],
    //        'prefix':  "users"
    //    }) ? "" : domain_model_preferredPrefix);
    //    Object.defineProperty(fn, `${tmp_prefix}users`, {
    //        value:      new Users({
    //            'prefix_ldp_model': prefix_ldp_model,
    //            //
    //            'type': [],
    //            'node': tmp_node,
    //            'fn':   undefined
    //        }),
    //        enumerable: true
    //    });
    //} // if ()

    //tmp_node = (node['groups'] || node[`${domain_model_preferredPrefix}groups`]);
    //if (tmp_node) {
    //    tmp_prefix = (contextHasPrefix({
    //        'context': Domain['@context'],
    //        'prefix':  "groups"
    //    }) ? "" : domain_model_preferredPrefix);
    //    Object.defineProperty(fn, `${tmp_prefix}groups`, {
    //        value:      new Groups({
    //            'prefix_ldp_model': prefix_ldp_model,
    //            //   'type': [],
    //            'node': tmp_node,
    //            'fn':   undefined
    //        }),
    //        enumerable: true
    //    });
    //}

    //tmp_node = (node['roles'] || node[`${domain_model_preferredPrefix}roles`]);
    //if (tmp_node) {
    //    tmp_prefix = (contextHasPrefix({
    //        'context': Domain['@context'],
    //        'prefix':  "roles"
    //    }) ? "" : domain_model_preferredPrefix);
    //    Object.defineProperty(fn, `${tmp_prefix}roles`, {
    //        value:      new Roles({
    //            'prefix_ldp_model': prefix_ldp_model,
    //            //  'type': [],
    //            'node': tmp_node,
    //            'fn':   undefined
    //        }),
    //        enumerable: true
    //    });
    //}

    //tmp_node = (node['memberships'] || node[`${domain_model_preferredPrefix}memberships`]);
    //if (tmp_node) {
    //    tmp_prefix = (contextHasPrefix({
    //        'context': Domain['@context'],
    //        'prefix':  "memberships"
    //    }) ? "" : domain_model_preferredPrefix);
    //    Object.defineProperty(fn, `${tmp_prefix}memberships`, {
    //        value:      new Memberships({
    //            'prefix_ldp_model': prefix_ldp_model,
    //            //   'type': [],
    //            'node': tmp_node,
    //            'fn':   undefined
    //        }),
    //        enumerable: true
    //    });
    //}

    //tmp_node = (node['credentials'] || node[`${domain_model_preferredPrefix}credentials`]);
    //if (tmp_node) {
    //    tmp_prefix = (contextHasPrefix({
    //        'context': Domain['@context'],
    //        'prefix':  "credentials"
    //    }) ? "" : domain_model_preferredPrefix);
    //    Object.defineProperty(fn, `${tmp_prefix}credentials`, {
    //        value:      new Credentials({
    //            'prefix_ldp_model': prefix_ldp_model,
    //            //  'type': [],
    //            'node': tmp_node,
    //            'fn':   undefined
    //        }),
    //        enumerable: true
    //    });
    //}

    // TODO : tickets
    // TODO : sessions

    Object.freeze(domain);

    return domain;
} // Domain()

Object.defineProperties(Domain, {
    'id': {value: "http://www.nicos-rd.com/fua/domain#Domain", enumerable: true}
});

exports.Domain = Domain;

//function Users({
//                   'prefix':           prefix = {
//                       'contains': "ldp:",
//                       'domain':   "domain:"
//                   },
//                   'prefix_ldp_model': prefix_ldp_model = "",
//                   //
//                   'type':      type = [],
//                   'predicate': predicate = undefined,
//                   'fn':        fn,
//                   'node':      node
//               }) {
//
//    let contains = new Map(); // REM: ldp:BasicContainer.contains
//
//    type.push(Users);
//    type.push("ldp:BasicContainer");
//
//    fn = (fn || (async function users(presentation) {
//        try {
//            presentation = (presentation || {});
//            presentation = {
//                '@context': undefined,
//                '@id':      (presentation['@id'] || users['@id']),
//                '@type':    users['@type'].map((type) => {
//                    return (type['@id'] || type);
//                })
//            };
//            let temp_prefix;
//
//            temp_prefix               = `${prefix_ldp_model}contains`;
//            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
//            presentation[temp_prefix] = await fn.key();
//
//            return presentation;
//        } catch (jex) {
//            throw jex;
//        } // try
//    })); // fn
//
//    if (new.target) {
//        if (!node['@id'])
//            throw new Error("Domain : Users :: id is missing");
//        Object.defineProperties(fn, {
//            '@id':   {value: node['@id'], enumerable: true},
//            '@type': {value: type, enumerable: true}
//        });
//    } // if ()
//
//    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
//    Object.defineProperties(fn, {
//        'key':   {
//            value:         async () => {
//                return [...contains.keys()];
//            }, enumerable: true
//        },
//        'value': {
//            value:         async () => {
//                return [...contains.values()];
//            }, enumerable: true
//        },
//        'has':   {
//            value:         async (id) => {
//                return (contains.get(((typeof id === "string") ? id : id['@id'])) ? true : false);
//            }, enumerable: true
//        },
//        'get':   {
//            value:         async (id) => {
//                return contains.get(id);
//            }, enumerable: true
//        },
//        'add':   {
//            /**
//             * TODO: node NOT string?!?
//             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
//             * */
//            value:         async (resource) => {
//                // TODO: node to array
//                try {
//                    // TODO: validate user
//                    contains.push(resource);
//                } catch (jex) {
//                    throw jex;
//                } // try
//            }, enumerable: false
//        } // add
//    }); // Object.defineProperties()
//
//    return fn;
//} // Users()
//Object.defineProperties(Users, {
//    '@context':        {
//        value:          [{
//            'sysm': "http://testbed.nicos-rd.com/fua/system#",
//            'domm': "http://testbed.nicos-rd.com/fua/domain#",
//            //
//            '@base':  "http://testbed.nicos-rd.com",
//            '@vocab': "/",
//            'tb':     "http://testbed.nicos-rd.com/",
//            'tbm':    "http://testbed.nicos-rd.com/",
//            //
//            'system':    "http://testbed.nicos-rd.com/fua/system#system",
//            'domain':    "http://testbed.nicos-rd.com/fua/domain#domain",
//            'testsuite': "http://testsuite.nicos-rd.com/"
//        }], enumerable: true
//    },
//    '@id':             {value: "http://nicos-rd.com/fua/domain#Users", enumerable: true},
//    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
//});
//exports.Users = Users;
//
//function Groups({
//                    'prefix':           prefix = {
//                        'contains': "ldp:",
//                        'member':   "ldp:",
//                        'domain':   "domain:"
//                    },
//                    'prefix_ldp_model': prefix_ldp_model = "",
//                    //
//                    'type':      type = [],
//                    'predicate': predicate = undefined,
//                    'fn':        fn,
//                    'node':      node
//                }) {
//
//    let contains = []; // REM: ldp:BasicContainer.contains
//
//    type.push(Groups);
//    type.push("ldp:BasicContainer");
//
//    fn = (fn || (async function groups(presentation) {
//        try {
//            presentation = (presentation || {});
//            presentation = {
//                '@context': undefined,
//                '@id':      (presentation['@id'] || groups['@id']),
//                '@type':    groups['@type'].map((type) => {
//                    return (type['@id'] || type);
//                })
//            };
//            let temp_prefix;
//
//            temp_prefix               = `${prefix_ldp_model}contains`;
//            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
//            presentation[temp_prefix] = (contains.map((resource) => {
//                return ((typeof resource === "string") ? resource : resource['@id']);
//            }) || []);
//
//            return presentation;
//        } catch (jex) {
//            throw jex;
//        } // try
//    }));
//
//    if (new.target) {
//        if (!node['@id'])
//            throw new Error("Groups : id is missing");
//        Object.defineProperties(fn, {
//            '@id':   {value: node['@id'], enumerable: true},
//            '@type': {value: type, enumerable: true}
//        });
//    } // if ()
//
//    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
//    Object.defineProperties(fn, {
//        'add': {
//            /**
//             * TODO: node NOT string?!?
//             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
//             * */
//            value:      async (resource) => {
//                // TODO: node to array
//                try {
//                    // TODO: validate user
//                    contains.push(resource);
//                } catch (jex) {
//                    throw jex;
//                } // try
//            },
//            enumerable: false
//        } // add
//    });
//
//    return fn;
//} // Groups()
//Object.defineProperties(Groups, {
//    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Groups", enumerable: true},
//    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
//});
//exports.Groups = Groups;
//
//function Roles({
//                   'prefix':           prefix = {
//                       'contains': "ldp:",
//                       'member':   "ldp:",
//                       'domain':   "domain:"
//                   },
//                   'prefix_ldp_model': prefix_ldp_model = "",
//                   //
//                   'type':      type = [],
//                   'predicate': predicate = undefined,
//                   'fn':        fn,
//                   'node':      node
//               }) {
//
//    let contains = []; // REM: ldp:BasicContainer.contains
//
//    type.push(Roles);
//    type.push("ldp:BasicContainer");
//
//    fn = (fn || (async function roles(presentation) {
//        try {
//            presentation = (presentation || {});
//            presentation = {
//                '@context': undefined,
//                '@id':      (presentation['@id'] || roles['@id']),
//                '@type':    roles['@type'].map((type) => {
//                    return (type['@id'] || type);
//                })
//            };
//            let temp_prefix;
//
//            temp_prefix               = `${prefix_ldp_model}contains`;
//            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
//            presentation[temp_prefix] = (contains.map((role) => {
//                return ((typeof role === "string") ? role : role['@id']);
//            }) || []);
//
//            return presentation;
//        } catch (jex) {
//            throw jex;
//        } // try
//    }));
//
//    if (new.target) {
//        if (!node['@id'])
//            throw new Error("Roles : id is missing");
//        Object.defineProperties(fn, {
//            '@id':   {value: node['@id'], enumerable: true},
//            '@type': {value: type, enumerable: true}
//        });
//    } // if ()
//
//    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
//    Object.defineProperties(fn, {
//        'add': {
//            /**
//             * TODO: node NOT string?!?
//             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
//             * */
//            value:      async (resource) => {
//                // TODO: node to array
//                try {
//                    // TODO: validate user
//                    contains.push(resource);
//                } catch (jex) {
//                    throw jex;
//                } // try
//            },
//            enumerable: false
//        } // add
//    });
//
//    return fn;
//} // Roles()
//Object.defineProperties(Roles, {
//    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Roles", enumerable: true},
//    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
//});
//exports.Roles = Roles;
//
//function Memberships({
//                         'prefix':           prefix = {
//                             'contains': "ldp:",
//                             'member':   "ldp:",
//                             'domain':   "domain:"
//                         },
//                         'prefix_ldp_model': prefix_ldp_model = "",
//                         //
//                         'type':      type = [],
//                         'predicate': predicate = undefined,
//                         'fn':        fn,
//                         'node':      node
//                     }) {
//
//    let contains = []; // REM: ldp:BasicContainer.contains
//
//    type.push(Memberships);
//    type.push("ldp:BasicContainer");
//
//    fn = (fn || (async function memberships(presentation) {
//        try {
//            presentation = (presentation || {});
//            presentation = {
//                '@context': undefined,
//                '@id':      (presentation['@id'] || memberships['@id']),
//                '@type':    memberships['@type'].map((type) => {
//                    return (type['@id'] || type);
//                })
//            };
//            let temp_prefix;
//
//            temp_prefix               = `${prefix_ldp_model}contains`;
//            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
//            presentation[temp_prefix] = (contains.map((membership) => {
//                return ((typeof membership === "string") ? membership : membership['@id']);
//            }) || []);
//
//            return presentation;
//        } catch (jex) {
//            throw jex;
//        } // try
//    }));
//    if (new.target) {
//        if (!node['@id'])
//            throw new Error("Memberships : id is missing");
//        Object.defineProperties(fn, {
//            '@id':   {value: node['@id'], enumerable: true},
//            '@type': {value: type, enumerable: true}
//        });
//    } // if ()
//
//    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
//    Object.defineProperties(fn, {
//        'add': {
//            /**
//             * TODO: node NOT string?!?
//             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
//             * */
//            value:      async (resource) => {
//                // TODO: node to array
//                try {
//                    // TODO: validate user
//                    contains.push(resource);
//                } catch (jex) {
//                    throw jex;
//                } // try
//            },
//            enumerable: false
//        } // add
//    });
//
//    return fn;
//} // Memberships()
//Object.defineProperties(Memberships, {
//    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Memberships", enumerable: true},
//    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
//});
//exports.Memberships = Memberships;
//
//function Credentials({
//                         'prefix':           prefix = {
//                             'contains': "ldp:",
//                             'member':   "ldp:",
//                             'domain':   "domain:"
//                         },
//                         'prefix_ldp_model': prefix_ldp_model = "",
//                         //
//                         'type':      type = [],
//                         'predicate': predicate = undefined,
//                         'fn':        fn,
//                         'node':      node
//                     }) {
//
//    let contains = []; // REM: ldp:BasicContainer.contains
//
//    type.push(Credentials);
//    type.push("ldp:BasicContainer");
//
//    fn = (fn || (async function credentials(presentation) {
//        try {
//            presentation = (presentation || {});
//            presentation = {
//                '@context': undefined,
//                '@id':      (presentation['@id'] || credentials['@id']),
//                '@type':    credentials['@type'].map((type) => {
//                    return (type['@id'] || type);
//                })
//            };
//            let temp_prefix;
//
//            temp_prefix               = `${prefix_ldp_model}contains`;
//            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
//            presentation[temp_prefix] = (contains.map((credential) => {
//                return ((typeof credential === "string") ? credential : credential['@id']);
//            }) || []);
//
//            return presentation;
//        } catch (jex) {
//            throw jex;
//        } // try
//    }));
//
//    if (new.target) {
//        if (!node['@id'])
//            throw new Error("Credentials : id is missing");
//        Object.defineProperties(fn, {
//            '@id':   {value: node['@id'], enumerable: true},
//            '@type': {value: type, enumerable: true}
//        });
//    } // if ()
//
//    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
//    Object.defineProperties(fn, {
//        'add': {
//            /**
//             * TODO: node NOT string?!?
//             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
//             * */
//            value:      async (resource) => {
//                // TODO: node to array
//                try {
//                    // TODO: validate user
//                    contains.push(resource);
//                } catch (jex) {
//                    throw jex;
//                } // try
//            },
//            enumerable: false
//        } // add
//    });
//
//    return fn;
//} // Credentials()
//Object.defineProperties(Credentials, {
//    "@context":        {
//        value:          [{
//            "foaf":  "http://xmlns.com/foaf/0.1/",
//            "Agent": "http://xmlns.com/foaf/0.1/Agent",
//            //
//            "sysm": "http://www.nicos-rd.com/fua/system#",
//            //
//            "@base":       "http://www.nicos-rd.com/fua/domain",
//            "vocab":       "#",
//            "Credentials": {"@type": "@vocab"},
//            "owner":       {"@type": "@vocab"},
//            //
//            "session": "http://www.nicos-rd.com/fua/session#session"
//        }], enumerable: true
//    },
//    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Credentials", enumerable: true},
//    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
//});
//exports.Credentials = Credentials;

// TODO : tickets
// TODO : sessions

// EOF