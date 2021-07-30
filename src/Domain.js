//region error

class ErrorDomainIdIsMissing extends Error {
    constructor(message) {
        super(`[${timestamp()}] : fua.agent.Domain : Domain :: ${message}`);
    }
}

//endregion error

function Domain({
                    'prefix':    prefix = {
                        'system': "sys:",
                        'sys':    "sys:",
                        'domain': "dom:",
                        'dom':    "dom:"
                    },
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

            temp_prefix = `${prefix['domain']}users`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix['domain']}groups`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix['domain']}roles`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix['domain']}memberships`;
            if (domain[temp_prefix] && !presentation[temp_prefix])
                presentation[temp_prefix] = await domain[temp_prefix]();

            temp_prefix = `${prefix['domain']}credentials`;
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

    tmp_node = (node['users'] || node[`${prefix['domain']}users`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix['domain']}users`, {
            value:      new Users({
                'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['groups'] || node[`${prefix['domain']}groups`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix['domain']}groups`, {
            value:      new Groups({
                'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['roles'] || node[`${prefix['domain']}roles`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix['domain']}roles`, {
            value:      new Roles({
                'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['memberships'] || node[`${prefix['domain']}memberships`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix['domain']}memberships`, {
            value:      new Memberships({
                'type': [],
                'node': tmp_node,
                'fn':   undefined
            }),
            enumerable: true
        });

    tmp_node = (node['credentials'] || node[`${prefix['domain']}credentials`]);
    if (tmp_node)
        Object.defineProperty(fn, `${prefix['domain']}credentials`, {
            value:      new Credentials({
                'type': [],
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
                   'prefix':    prefix = {
                       'contains': "ldp:",
                       'domain':   "domain:"
                   },
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

            temp_prefix               = `${prefix.contains}contains`;
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
            value:      async (user) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(user);
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
                    'prefix':    prefix = {
                        'contains': "ldp:",
                        'member':   "ldp:",
                        'domain':   "domain:"
                    },
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

            temp_prefix               = `${prefix.contains}contains`;
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
                   'prefix':    prefix = {
                       'contains': "ldp:",
                       'member':   "ldp:",
                       'domain':   "domain:"
                   },
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

            temp_prefix               = `${prefix.contains}contains`;
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
            value:      async (role) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(role);
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
                         'prefix':    prefix = {
                             'contains': "ldp:",
                             'member':   "ldp:",
                             'domain':   "domain:"
                         },
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

            temp_prefix               = `${prefix.contains}contains`;
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
            value:      async (role) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(role);
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
                         'prefix':    prefix = {
                             'contains': "ldp:",
                             'member':   "ldp:",
                             'domain':   "domain:"
                         },
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

            temp_prefix               = `${prefix.contains}contains`;
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
            value:      async (role) => {
                // TODO: node to array
                try {
                    // TODO: validate user
                    contains.push(role);
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

