import keycloakService from '../services/keycloakService'
import { MicroFrontendConfig as profile } from 'app/main/profile/MicroFrontendConfig';
/*AUTOGEN_MFE_IMPORTS*/

class MicroFrontendIntegrator {

    constructor() {
        console.log('MicroFrontendIntegrator: singleton instance created');
        this.initializeMicroFrontendsListing();
        this.initializeRouteConfigs();
        this.navigationConfig = [];
    }

    initializeMicroFrontendsListing() {
        this.microFrontendListing = [
            profile,
            /*AUTOGEN_MFE_LISTING*/
        ];
    }

    initializeRouteConfigs() {
        this.routeConfigs = this.microFrontendListing.map(c => ({ settings: c.settings, routes: c.routes, auth: c.auth }));
    }

    initializeI18n(locale) {
        this.i18nTexts = this.microFrontendListing
            .map(mfe => mfe.i18nLocales)
            .map(locales => {
                if (locales[locale]) {
                    return locales[locale]
                }
                return locales[locale.split('_')[0]] || locales.en;
            })
            .map(locale => locale.navigation || {})
            .reduce(
                (acc, navi18n) => {
                    return { ...acc, ...navi18n };
                }, {}
            )
    }

    initializeNavigationConfigs() {
        this.navigationConfig = [];
        this.nodeMap = {};

        this.initializeI18n(keycloakService.user.locale);

        this.microFrontendListing
            .map(config => config.navigationConfig)
            .reduce((acc, val) => { acc.push(...val); return acc; }, [])// flat map
            .forEach(navConfig => {
                this.populateNavigationConfig([navConfig.id], undefined, navConfig)
            });


        this.navigationConfig.forEach(root => this.removeUnusedBranches(root));
        this.navigationConfig.sort((c1, c2) => (c2.priority || 0) - (c1.priority || 0));
        this.navigationConfig = this.navigationConfig.filter(nav => (nav.type === 'item') || ((nav.children || []).length > 0))
    }


    populateNavigationConfig(path, parent, node) {
        const nodeRef = this.extractNodeMapRef(path, node);
        if (parent && parent.children.filter(c => c.id === nodeRef.id).length === 0) {
            parent.children.push(nodeRef);
        }
        if ((node.children || []).length > 0) { // is parent
            node.children.forEach(child => {
                this.populateNavigationConfig([...path, child.id], nodeRef, child);
            });
        } else { // is leaf
            const auth = (nodeRef.auth || []);
            const hasAccess = auth.length <= 0
                ? true
                : nodeRef.auth
                    .filter(neededPermission => {
                        const kcPerms = keycloakService.getPermissions();
                        return kcPerms.includes(neededPermission);
                    })
                    .length > 0;
            nodeRef.hasAccess = hasAccess;
        }

    }

    extractNodeMapRef(path, node) {
        const pathStr = this.convertPathToString(path);
        let reference = this.nodeMap[pathStr];
        if (!reference) {
            const reference = { ...node, title: this.i18nTexts[node.id],  children: [] };
            this.nodeMap[pathStr] = reference;
            if (path.length === 1) {
                this.navigationConfig.push(reference);
            }
        }
        return this.nodeMap[pathStr];
    }

    convertPathToString(path) {
        return path ? path.join('->') : "";
    }


    removeUnusedBranches(branch) {
        const hasLeaves = this.hasLeaves(branch);
        if (!hasLeaves) {
            branch.children = [];
        } else {
            branch.children.sort((c1, c2) => ((c2 || {}).priority || 0) - ((c1 || {}).priority || 0));
            (branch.children || []).forEach(child =>
                this.removeUnusedBranches(child)
            )
        }
    }

    hasLeaves(branch) {
        if ((branch.children || []).length > 0) {
            for (let i = 0; i < (branch.children || []).length; i++) {
                if (this.hasLeaves(branch.children[i])) {
                    return true;
                }
            }
            return false;
        }
        return branch.hasAccess;
    }

}

const instance = new MicroFrontendIntegrator();

export default instance;