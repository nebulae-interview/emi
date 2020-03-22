import React from 'react';
import i18n from './i18n'

export const MicroFrontendConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/profile',
            component: React.lazy(() => import('./ProfilePage'))
        }
    ],
    navigationConfig: [
        {
            'id': 'profile',
            'type': 'item',
            'icon': 'person_outline',
            'url': '/profile',
            'priority': 100000,
        }
    ],
    i18nLocales: i18n.locales
};

