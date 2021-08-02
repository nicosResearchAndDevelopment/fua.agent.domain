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
                    'type':      type = [],
                    'predicate': predicate = undefined,
                    'fn':        fn,
                    'node':      node
                }) {

    let tmp_node = undefined;

    type.push(Domain);

    fn = (fn || (async function domain(presentation) {
        try {
            presentation    = (presentation || {});
            presentation    = {
                '@id':   (presentation['@id'] || domain['@id']),
                '@type': domain['@type'].map((type) => {
                    return (type['@id'] || type);
                })
            };
            let temp_prefix = "";

            temp_prefix = `${prefix_domain_model}users`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix_domain_model}groups`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix_domain_model}roles`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix_domain_model}memberships`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix_domain_model}credentials`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

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

    tmp_node = (node['users'] || node[`${prefix_domain_model}users`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix_domain_model}users`, {
            value:      new Users({
                'prefix_ldp_model': prefix_ldp_model,
                //
                'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['groups'] || node[`${prefix_domain_model}groups`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix_domain_model}groups`, {
            value:      new Groups({
                'prefix_ldp_model': prefix_ldp_model,
                //   'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['roles'] || node[`${prefix_domain_model}roles`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix_domain_model}roles`, {
            value:      new Roles({
                'prefix_ldp_model': prefix_ldp_model,
                //  'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['memberships'] || node[`${prefix_domain_model}memberships`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix_domain_model}memberships`, {
            value:      new Memberships({
                'prefix_ldp_model': prefix_ldp_model,
                //   'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['credentials'] || node[`${prefix_domain_model}credentials`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix_domain_model}credentials`, {
            value:      new Credentials({
                'prefix_ldp_model': prefix_ldp_model,
                //  'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    return fn;
} // Domain()
Object.defineProperties(Domain, {
    '@id': {value: "fua.domain.Domain", enumerable: true}
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

    let contains = []; // REM: ldp:BasicContainer.contains

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
            presentation[temp_prefix] = (contains.map((user) => {
                return ((typeof user === "string") ? user : user['@id']);
            }) || []);

            return presentation;
        } catch (jex) {
            throw jex;
        } // try
    }));

    if (new.target) {
        if (!node['@id'])
            throw new Error("Users : id is missing");
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
} // Users()
Object.defineProperties(Users, {
    '@id':             {value: "fua.domain.Users", enumerable: true},
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

    type.push(Users);
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
    '@id':             {value: "fua.domain.Groups", enumerable: true},
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

    type.push(Users);
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
    '@id':             {value: "fua.domain.Roles", enumerable: true},
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

    type.push(Users);
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
    '@id':             {value: "fua.domain.Memberships", enumerable: true},
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

    type.push(Users);
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
    '@id':             {value: "fua.domain.Credentials", enumerable: true},
    'rdfs:subClassOf': {value: "ldp:BasicContainer", enumerable: true}
});
exports.Credentials = Credentials;

