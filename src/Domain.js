const
    domain_model_preferredPrefix = "domm:"
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
                    '@context':               context_parent = [],
                    '@id':                    id,
                    'prefix':                 prefix = {
                        'system': "sys:",
                        'sys':    "sys:",
                        'domain': "dom:",
                        'dom':    "dom:"
                    },
                    'prefix_self':            prefix_self = "",
                    'prefix_self_model':      prefix_self_model = "",
                    'prefix_system':          prefix_system = "",
                    'prefix_system_model':    prefix_system_model = "",
                    'prefix_domain':          prefix_domain = "",
                    'prefix_domain_model':    prefix_domain_model = "",
                    'prefix_ldp_model':       prefix_ldp_model = "ldp:",
                    'prefix_testsuite':       prefix_testsuite = "",
                    'prefix_testsuite_model': prefix_testsuite_model = "",
                    'prefix_testbed':         prefix_testbed = "",
                    'prefix_testbed_model':   prefix_testbed_model = "",
                    //
                    'type':             type = [],
                    'predicate':        predicate = undefined,
                    'fn':               fn,
                    'node':             node,
                    'owner':            owner,
                    'contextHasPrefix': contextHasPrefix,
                    'idAsBlankNode':    idAsBlankNode,
                    'randomLeaveId':    randomLeaveId
                }) {

    const
        context_self = context_parent.concat(Domain['@context']) // REM: self context
    ;
    let
        tmp_node     = undefined,
        tmp_prefix   = undefined
    ;

    id = ((id) ? id : idAsBlankNode("domain/"));
    type.push(Domain);

    fn = (fn || (async function domain(presentation) {
        try {
            presentation = (presentation || {});
            presentation = {
                '@id':   (presentation['@id'] || domain['@id']),
                '@type': domain['@type'].map((type) => {
                    return (type['@id'] || type);
                })
            };

            let tmp_predicate = "";

            tmp_predicate = (contextHasPrefix({
                'context': Domain['@context'],
                'prefix':  "owner"
            }) ? "owner" : `${domain_model_preferredPrefix}:owner`);
            if (domain[tmp_predicate] && !presentation[tmp_predicate])
                presentation[tmp_predicate] = await domain[tmp_predicate]();

            tmp_predicate = (contextHasPrefix({
                'context': Domain['@context'],
                'prefix':  "users"
            }) ? "users" : `${domain_model_preferredPrefix}:users`);
            if (domain[tmp_predicate] && !presentation[tmp_predicate])
                presentation[tmp_predicate] = await domain[tmp_predicate]();

            tmp_predicate = (contextHasPrefix({
                'context': Domain['@context'],
                'prefix':  "groups"
            }) ? "groups" : `${domain_model_preferredPrefix}:groups`);
            if (domain[tmp_predicate] && !presentation[tmp_predicate])
                presentation[tmp_predicate] = await domain[tmp_predicate]();

            tmp_predicate = (contextHasPrefix({
                'context': Domain['@context'],
                'prefix':  "roles"
            }) ? "roles" : `${domain_model_preferredPrefix}:roles`);
            if (domain[tmp_predicate] && !presentation[tmp_predicate])
                presentation[tmp_predicate] = await domain[tmp_predicate]();

            tmp_predicate = (contextHasPrefix({
                'context': Domain['@context'],
                'prefix':  "memberships"
            }) ? "memberships" : `${domain_model_preferredPrefix}:memberships`);
            if (domain[tmp_predicate] && !presentation[tmp_predicate])
                presentation[tmp_predicate] = await domain[tmp_predicate]();

            tmp_predicate = (contextHasPrefix({
                'context': Domain['@context'],
                'prefix':  "credentials"
            }) ? "credentials" : `${domain_model_preferredPrefix}:credentials`);
            if (domain[tmp_predicate] && !presentation[tmp_predicate])
                presentation[tmp_predicate] = await domain[tmp_predicate]();

            // TODO : tickets
            // TODO : sessions

            return presentation;
        } catch (jex) {
            throw jex;
        } // try
    }));

    if (new.target) {
        if (!node['@id'])
            throw new ErrorDomainIdIsMissing("id is missing");
        Object.defineProperties(fn, {
            '@id':   {value: node['@id'], enumerable: true},
            '@type': {value: type, enumerable: true}
        });
    } // if ()

    tmp_prefix = (contextHasPrefix({'context': Domain['@context'], 'prefix': "owner"}) ? "" : "system:");
    Object.defineProperties(fn, {
        [`${tmp_prefix}owner`]: {
            value:      async () => {
                return {
                    '@id':   ((typeof node['owner'] === "string") ? node['owner'] : (node['owner']['@id'] || null)),
                    '@type': "foaf:Agent"
                };
            },
            enumerable: true
        }
    }); // Object.defineProperties()

    tmp_node = (node['users'] || node[`${domain_model_preferredPrefix}users`]);
    if (tmp_node) {
        tmp_prefix = (contextHasPrefix({
            'context': Domain['@context'],
            'prefix':  "users"
        }) ? "" : domain_model_preferredPrefix);
        Object.defineProperty(fn, `${tmp_prefix}users`, {
            value:      new Users({
                'prefix_ldp_model': prefix_ldp_model,
                //
                'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });
    } // if ()

    tmp_node = (node['groups'] || node[`${domain_model_preferredPrefix}groups`]);
    if (tmp_node) {
        tmp_prefix = (contextHasPrefix({
            'context': Domain['@context'],
            'prefix':  "groups"
        }) ? "" : domain_model_preferredPrefix);
        Object.defineProperty(fn, `${tmp_prefix}groups`, {
            value:      new Groups({
                'prefix_ldp_model': prefix_ldp_model,
                //   'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });
    }

    tmp_node = (node['roles'] || node[`${domain_model_preferredPrefix}roles`]);
    if (tmp_node) {
        tmp_prefix = (contextHasPrefix({
            'context': Domain['@context'],
            'prefix':  "roles"
        }) ? "" : domain_model_preferredPrefix);
        Object.defineProperty(fn, `${tmp_prefix}roles`, {
            value:      new Roles({
                'prefix_ldp_model': prefix_ldp_model,
                //  'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });
    }

    tmp_node = (node['memberships'] || node[`${domain_model_preferredPrefix}memberships`]);
    if (tmp_node) {
        tmp_prefix = (contextHasPrefix({
            'context': Domain['@context'],
            'prefix':  "memberships"
        }) ? "" : domain_model_preferredPrefix);
        Object.defineProperty(fn, `${tmp_prefix}memberships`, {
            value:      new Memberships({
                'prefix_ldp_model': prefix_ldp_model,
                //   'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });
    }

    tmp_node = (node['credentials'] || node[`${domain_model_preferredPrefix}credentials`]);
    if (tmp_node) {
        tmp_prefix = (contextHasPrefix({
            'context': Domain['@context'],
            'prefix':  "credentials"
        }) ? "" : domain_model_preferredPrefix);
        Object.defineProperty(fn, `${tmp_prefix}credentials`, {
            value:      new Credentials({
                'prefix_ldp_model': prefix_ldp_model,
                //  'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });
    }

    // TODO : tickets
    // TODO : sessions

    return fn;
} // Domain()
Object.defineProperties(Domain, {
    '@context': {
        value:          [{
            '@base': "http://testbed.nicos-rd.com/fua/domain#Domain",
            'domm':  "http://testbed.nicos-rd.com/fua/domain#",
            //
            'Domain':      "http://testbed.nicos-rd.com/fua/domain#Domain",
            'domain':      "http://testbed.nicos-rd.com/fua/domain#domain",
            'owner':       "http://testbed.nicos-rd.com/fua/domain#owner",
            'users':       "http://testbed.nicos-rd.com/fua/domain#Users",
            'groups':      "http://testbed.nicos-rd.com/fua/domain#Groups",
            'roles':       "http://testbed.nicos-rd.com/fua/domain#Roles",
            'memberships': "http://testbed.nicos-rd.com/fua/domain#Memberships",
            'credentials': "http://testbed.nicos-rd.com/fua/domain#Credentials"
        }], enumerable: true
    },
    '@id':      {value: "http://testbed.nicos-rd.com/fua/domain#Domain", enumerable: true}
});
exports.Domain = Domain;

function Users({
                   'prefix':           prefix = {
                       'contains': "ldp:",
                       'domain':   "domain:"
                   },
                   'prefix_ldp_model': prefix_ldp_model = "",
                   //
                   'type':      type = [],
                   'predicate': predicate = undefined,
                   'fn':        fn,
                   'node':      node
               }) {

    let contains = new Map(); // REM: ldp:BasicContainer.contains

    type.push(Users);
    type.push("ldp:BasicContainer");

    fn = (fn || (async function users(presentation) {
        try {
            presentation = (presentation || {});
            presentation = {
                '@context': undefined,
                '@id':      (presentation['@id'] || users['@id']),
                '@type':    users['@type'].map((type) => {
                    return (type['@id'] || type);
                })
            };
            let temp_prefix;

            temp_prefix               = `${prefix_ldp_model}contains`;
            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
            presentation[temp_prefix] = await fn.key();

            return presentation;
        } catch (jex) {
            throw jex;
        } // try
    })); // fn

    if (new.target) {
        if (!node['@id'])
            throw new Error("Domain : Users :: id is missing");
        Object.defineProperties(fn, {
            '@id':   {value: node['@id'], enumerable: true},
            '@type': {value: type, enumerable: true}
        });
    } // if ()

    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
    Object.defineProperties(fn, {
        'key':   {
            value:         async () => {
                return [...contains.keys()];
            }, enumerable: true
        },
        'value': {
            value:         async () => {
                return [...contains.values()];
            }, enumerable: true
        },
        'has':   {
            value:         async (id) => {
                return (contains.get(((typeof id === "string") ? id : id['@id'])) ? true : false);
            }, enumerable: true
        },
        'get':   {
            value:         async (id) => {
                return contains.get(id);
            }, enumerable: true
        },
        'add':   {
            /**
             * TODO: node NOT string?!?
             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
             * */
            value:         async (resource) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(resource);
                } catch (jex) {
                    throw jex;
                } // try
            }, enumerable: false
        } // add
    }); // Object.defineProperties()

    return fn;
} // Users()
Object.defineProperties(Users, {
    '@context':        {
        value:          [{
            'sysm': "http://testbed.nicos-rd.com/fua/system#",
            'domm': "http://testbed.nicos-rd.com/fua/domain#",
            //
            '@base':  "http://testbed.nicos-rd.com",
            '@vocab': "/",
            'tb':     "http://testbed.nicos-rd.com/",
            'tbm':    "http://testbed.nicos-rd.com/",
            //
            'system':    "http://testbed.nicos-rd.com/fua/system#system",
            'domain':    "http://testbed.nicos-rd.com/fua/domain#domain",
            'testsuite': "http://testsuite.nicos-rd.com/"
        }], enumerable: true
    },
    '@id':             {value: "http://nicos-rd.com/fua/domain#Users", enumerable: true},
    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
});
exports.Users = Users;

function Groups({
                    'prefix':           prefix = {
                        'contains': "ldp:",
                        'member':   "ldp:",
                        'domain':   "domain:"
                    },
                    'prefix_ldp_model': prefix_ldp_model = "",
                    //
                    'type':      type = [],
                    'predicate': predicate = undefined,
                    'fn':        fn,
                    'node':      node
                }) {

    let contains = []; // REM: ldp:BasicContainer.contains

    type.push(Groups);
    type.push("ldp:BasicContainer");

    fn = (fn || (async function groups(presentation) {
        try {
            presentation = (presentation || {});
            presentation = {
                '@context': undefined,
                '@id':      (presentation['@id'] || groups['@id']),
                '@type':    groups['@type'].map((type) => {
                    return (type['@id'] || type);
                })
            };
            let temp_prefix;

            temp_prefix               = `${prefix_ldp_model}contains`;
            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
            presentation[temp_prefix] = (contains.map((resource) => {
                return ((typeof resource === "string") ? resource : resource['@id']);
            }) || []);

            return presentation;
        } catch (jex) {
            throw jex;
        } // try
    }));

    if (new.target) {
        if (!node['@id'])
            throw new Error("Groups : id is missing");
        Object.defineProperties(fn, {
            '@id':   {value: node['@id'], enumerable: true},
            '@type': {value: type, enumerable: true}
        });
    } // if ()

    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
    Object.defineProperties(fn, {
        'add': {
            /**
             * TODO: node NOT string?!?
             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
             * */
            value:      async (resource) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(resource);
                } catch (jex) {
                    throw jex;
                } // try
            },
            enumerable: false
        } // add
    });

    return fn;
} // Groups()
Object.defineProperties(Groups, {
    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Groups", enumerable: true},
    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
});
exports.Groups = Groups;

function Roles({
                   'prefix':           prefix = {
                       'contains': "ldp:",
                       'member':   "ldp:",
                       'domain':   "domain:"
                   },
                   'prefix_ldp_model': prefix_ldp_model = "",
                   //
                   'type':      type = [],
                   'predicate': predicate = undefined,
                   'fn':        fn,
                   'node':      node
               }) {

    let contains = []; // REM: ldp:BasicContainer.contains

    type.push(Roles);
    type.push("ldp:BasicContainer");

    fn = (fn || (async function roles(presentation) {
        try {
            presentation = (presentation || {});
            presentation = {
                '@context': undefined,
                '@id':      (presentation['@id'] || roles['@id']),
                '@type':    roles['@type'].map((type) => {
                    return (type['@id'] || type);
                })
            };
            let temp_prefix;

            temp_prefix               = `${prefix_ldp_model}contains`;
            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
            presentation[temp_prefix] = (contains.map((role) => {
                return ((typeof role === "string") ? role : role['@id']);
            }) || []);

            return presentation;
        } catch (jex) {
            throw jex;
        } // try
    }));

    if (new.target) {
        if (!node['@id'])
            throw new Error("Roles : id is missing");
        Object.defineProperties(fn, {
            '@id':   {value: node['@id'], enumerable: true},
            '@type': {value: type, enumerable: true}
        });
    } // if ()

    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
    Object.defineProperties(fn, {
        'add': {
            /**
             * TODO: node NOT string?!?
             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
             * */
            value:      async (resource) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(resource);
                } catch (jex) {
                    throw jex;
                } // try
            },
            enumerable: false
        } // add
    });

    return fn;
} // Roles()
Object.defineProperties(Roles, {
    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Roles", enumerable: true},
    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
});
exports.Roles = Roles;

function Memberships({
                         'prefix':           prefix = {
                             'contains': "ldp:",
                             'member':   "ldp:",
                             'domain':   "domain:"
                         },
                         'prefix_ldp_model': prefix_ldp_model = "",
                         //
                         'type':      type = [],
                         'predicate': predicate = undefined,
                         'fn':        fn,
                         'node':      node
                     }) {

    let contains = []; // REM: ldp:BasicContainer.contains

    type.push(Memberships);
    type.push("ldp:BasicContainer");

    fn = (fn || (async function memberships(presentation) {
        try {
            presentation = (presentation || {});
            presentation = {
                '@context': undefined,
                '@id':      (presentation['@id'] || memberships['@id']),
                '@type':    memberships['@type'].map((type) => {
                    return (type['@id'] || type);
                })
            };
            let temp_prefix;

            temp_prefix               = `${prefix_ldp_model}contains`;
            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
            presentation[temp_prefix] = (contains.map((membership) => {
                return ((typeof membership === "string") ? membership : membership['@id']);
            }) || []);

            return presentation;
        } catch (jex) {
            throw jex;
        } // try
    }));
    if (new.target) {
        if (!node['@id'])
            throw new Error("Memberships : id is missing");
        Object.defineProperties(fn, {
            '@id':   {value: node['@id'], enumerable: true},
            '@type': {value: type, enumerable: true}
        });
    } // if ()

    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
    Object.defineProperties(fn, {
        'add': {
            /**
             * TODO: node NOT string?!?
             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
             * */
            value:      async (resource) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(resource);
                } catch (jex) {
                    throw jex;
                } // try
            },
            enumerable: false
        } // add
    });

    return fn;
} // Memberships()
Object.defineProperties(Memberships, {
    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Memberships", enumerable: true},
    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
});
exports.Memberships = Memberships;

function Credentials({
                         'prefix':           prefix = {
                             'contains': "ldp:",
                             'member':   "ldp:",
                             'domain':   "domain:"
                         },
                         'prefix_ldp_model': prefix_ldp_model = "",
                         //
                         'type':      type = [],
                         'predicate': predicate = undefined,
                         'fn':        fn,
                         'node':      node
                     }) {

    let contains = []; // REM: ldp:BasicContainer.contains

    type.push(Credentials);
    type.push("ldp:BasicContainer");

    fn = (fn || (async function credentials(presentation) {
        try {
            presentation = (presentation || {});
            presentation = {
                '@context': undefined,
                '@id':      (presentation['@id'] || credentials['@id']),
                '@type':    credentials['@type'].map((type) => {
                    return (type['@id'] || type);
                })
            };
            let temp_prefix;

            temp_prefix               = `${prefix_ldp_model}contains`;
            // TODO: wie sieht das im graphen (node) aus... wie sind die users dort abgebildet?
            presentation[temp_prefix] = (contains.map((credential) => {
                return ((typeof credential === "string") ? credential : credential['@id']);
            }) || []);

            return presentation;
        } catch (jex) {
            throw jex;
        } // try
    }));

    if (new.target) {
        if (!node['@id'])
            throw new Error("Credentials : id is missing");
        Object.defineProperties(fn, {
            '@id':   {value: node['@id'], enumerable: true},
            '@type': {value: type, enumerable: true}
        });
    } // if ()

    // TODO: this has to come from a decorator (decorate ldp:BasicContainer)
    Object.defineProperties(fn, {
        'add': {
            /**
             * TODO: node NOT string?!?
             * TODO: if we decide to accept string, so user has already to be in place in given store!!!
             * */
            value:      async (resource) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(resource);
                } catch (jex) {
                    throw jex;
                } // try
            },
            enumerable: false
        } // add
    });

    return fn;
} // Credentials()
Object.defineProperties(Credentials, {
    "@context":        {
        value:          [{
            "foaf":  "http://xmlns.com/foaf/0.1/",
            "Agent": "http://xmlns.com/foaf/0.1/Agent",
            //
            "sysm": "http://www.nicos-rd.com/fua/system#",
            //
            "@base":       "http://www.nicos-rd.com/fua/domain",
            "vocab":       "#",
            "Credentials": {"@type": "@vocab"},
            "owner":       {"@type": "@vocab"},
            //
            "session": "http://www.nicos-rd.com/fua/session#session"
        }], enumerable: true
    },
    '@id':             {value: "http://www.nicos-rd.com/fua/domain#Credentials", enumerable: true},
    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
});
exports.Credentials = Credentials;

// TODO : tickets
// TODO : sessions

// EOF