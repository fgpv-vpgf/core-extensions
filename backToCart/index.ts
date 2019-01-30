export default class BackToCart {
    // A store of the instances of backToCart, 1 per map
    static instances: { [id: string]: BackToCart } = {};

    /**
     * Sets a specific backToCart instance's catalogue url
     *
     * @param {string} mapId         Map ID for the backToCart instance you want to change
     * @param {string} template      The destination URL with '{RV_LAYER_LIST}' marking where the layer keys should go
     */
    static setCatalogueUrl(mapId: string, template: string): void {
        BackToCart.instances[mapId].template = template;
        BackToCart.instances[mapId].activateButton();
    }

    /**
     * Adds a button to RAMP's side menu
     */
    activateButton(): void {
        this.api.mapI.addPluginButton(BackToCart.prototype.translations[this._RV.getCurrentLang()], this.onMenuItemClick());
    }

    /**
     * Returns a promise that resolves with the backToCart URL
     */
    getCatalogueUrl(): string {
        if (!this.template) {
            console.warn('<Back to Cart> Trying to get URL before template is set');
            return '';
        }
        return this.template.replace('{RV_LAYER_LIST}', this._RV.getRcsLayerIDs().toString());
    }

    /**
     * Callback for the RAMP button, sets session storage and then redirects the browser to the catalogueUrl
     */
    onMenuItemClick(): () => void {
        return () => {
            // save bookmark in local storage so it is restored when user returns
            sessionStorage.setItem(this.api.id, this._RV.getBookmark());
            window.location.href = this.getCatalogueUrl();
        };
    }

    /**
     * Auto called by RAMP startup, stores the map api and puts the instance in BackToCart.instances
     *
     * @param {any} api     map api given by RAMP
     */
    init(api: any): void {
        this.api = api;
        BackToCart.instances[this.api.id] = this;
    }
}

export default interface BackToCart {
    api: any;
    _RV: any;
    template: string;
    translations: any;
}

BackToCart.prototype.translations = {
    'en-CA': 'Back to Cart',
    'fr-CA': 'Retour au panier'
};

(<any>window).backToCart = BackToCart;