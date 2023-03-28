export const serviceUrl = (path = false) => {
    let url = process.env.NODE_ENV === "development" ?  process.env.REACT_APP_REST_URL : 'https://app.dev.shopadjust-apps.com/packages/api' ; 
    let configs = localStorage.getItem('sa-config');
    try {
        configs = JSON.parse(configs)
        let domain = configs.store;
        if(path) url = url + '/' + path
        url = url + '?domain=' + domain;
    } catch (error) {
        
    }

    return url;
}