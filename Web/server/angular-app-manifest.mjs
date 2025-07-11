
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 789, hash: 'cf1a956723c87c7779a5c68503af63e228c3be21a77687b22be8619f3a60dd21', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 944, hash: '5f54e5ba73efb8cfe4f859409b37a17cb7d5ad5e62c91f8b776fabb60d47a1aa', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 6847, hash: '73fae75cedc99cfd78f6ffa6f1bb91e9870ee83daa50a995fc5bccead28e4013', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-3WBHAPXV.css': {size: 268, hash: '9zF6tdifv0A', text: () => import('./assets-chunks/styles-3WBHAPXV_css.mjs').then(m => m.default)}
  },
};
