document.addEventListener('DOMContentLoaded', () => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'macos';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'ios';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'windows';
    } else if (/Android/.test(userAgent)) {
        os = 'android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'linux';
    }

    const detectionLabel = document.getElementById('detected-os');
    const dlWindows = document.getElementById('dl-windows');
    const dlMacos = document.getElementById('dl-macos');
    const dlLinux = document.getElementById('dl-linux');

    // Default: Show all if detection fails
    if (!os) {
        detectionLabel.innerText = "Available for all platforms";
        dlWindows.classList.add('show');
        dlMacos.classList.add('show');
        dlLinux.classList.add('show');
        return;
    }

    detectionLabel.innerText = `We've detected you're using ${os.charAt(0).toUpperCase() + os.slice(1)}`;

    if (os === 'windows') {
        dlWindows.classList.add('show');
        dlMacos.style.display = 'inline-flex';
        dlLinux.style.display = 'inline-flex';
        dlMacos.classList.add('btn-secondary');
        dlLinux.classList.add('btn-secondary');
    } else if (os === 'macos') {
        dlMacos.classList.add('show');
        dlWindows.style.display = 'inline-flex';
        dlLinux.style.display = 'inline-flex';
        dlWindows.classList.add('btn-secondary');
        dlLinux.classList.add('btn-secondary');
    } else if (os === 'linux') {
        dlLinux.classList.add('show');
        dlWindows.style.display = 'inline-flex';
        dlMacos.style.display = 'inline-flex';
        dlWindows.classList.add('btn-secondary');
        dlMacos.classList.add('btn-secondary');
    } else {
        // Mobile or other: Show all
        dlWindows.classList.add('show');
        dlMacos.classList.add('show');
        dlLinux.classList.add('show');
    }
});
