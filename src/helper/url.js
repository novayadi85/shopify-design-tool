export const serviceUrl = () => {
    let url = process.env.REACT_APP_REST_URL
    let configs = localStorage.getItem('sa-config');
    try {
        configs = JSON.parse(configs)
        let domain = configs.store;
        url = url + '?domain=' + domain;
    } catch (error) {
        
    }

    return url;
}