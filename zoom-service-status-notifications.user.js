// ==UserScript==
// @name         Utility: Service Status Notifications
// @namespace    http://github.com/tidusx18
// @version      0.0.1
// @description  Pushes native desktop alert if an issue is found with Zoom. Checks Zoom's service status pages once every 30 minutes.
// @author       Daniel Victoriano <victoriano518@gmail.com>
// @updateURL
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

        function notification(name) {
            dispatchNotification = () => {
                GM_notification({
                    text: `Issue Detected with Zoom!`,
                    title: name,
                    highlight: false,
                    timeout: 10000 // time is in milliseconds (1000 == 1 second)
                })
            }
        }

            fetch('https://status.zoom.us/api/v2/status.json')
                .then(res => res.json())
                .then(res => {

                        res.status.description == 'All Systems Operational' ?
                            console.log(`Zoom: All Systems Operational`) :
                            notification('Zoom')
                })
    }, 1800000)

})();