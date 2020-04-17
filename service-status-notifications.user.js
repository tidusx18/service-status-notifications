// ==UserScript==
// @name         Utility: Service Status Notifications
// @namespace    http://github.com/tidusx18
// @version      0.0.1
// @description  Pushes native desktop alert if an issue is found with Canvas, Honorlock, Pearson, Turnitin, or Zoom. Checks their respective service status pages once every 30 minutes.
// @author       Daniel Victoriano <victoriano518@gmail.com>
// @updateURL    https://github.com/tidusx18/service-status-notifications/raw/master/service-status-notifications.user.js
// @match        *://*/*
// @connect      status.instructure.com
// @connect      status.honorlock.com
// @connect      turnitin.statuspage.io
// @connect      status.zoom.us
// @connect      ecollege-prod.apigee.net
// @run-at       default
// @noframes
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {

    setInterval(() => {

        let services = [
            'https://status.instructure.com/api/v2/status.json',
            'https://ecollege-prod.apigee.net/psp/v2/productstatus.do',
            'https://turnitin.statuspage.io/api/v2/status.json',
            'https://status.honorlock.com/api/v2/status.json',
            'https://status.zoom.us/api/v2/status.json'
        ]

        function notification(name) {
            dispatchNotification = () => {
                GM_notification({
                    text: `Issue Detected with ${name}!`,
                    title: name,
                    highlight: false,
                    timeout: 10000 // time is in milliseconds (1000 == 1 second)
                })
            }
        }

        services.forEach(service => {
            fetch(service)
                .then(res => res.json())
                .then(res => {

                    // Pearson includes statuses for multiple services and JSON structure is differrent than others.
                    if (service == 'https://ecollege-prod.apigee.net/psp/v2/productstatus.do') {
                        fetch('https://ecollege-prod.apigee.net/psp/v2/productstatus.do')
                            .then(res => res.json())
                            .then(res => {
                                res.products.forEach(product => {
                                    if (product.status) {
                                        notification(product.name)
                                    }

                                    else { console.log(`${product.name}: All Systems Operational`) }
                                })
                            })
                    }

                    // Notifications from all other services
                    else {
                        res.status.description == 'All Systems Operational' ?
                            console.log(`${res.page.name}: All Systems Operational`) :
                            notification(res.page.name)
                    }
                })
        })

    }, 1800000)

})();