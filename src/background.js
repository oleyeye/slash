const options = {
    google: {
        name: "google", id: "slash.google", title: "🥧 Google",
        sites: ["https://*.google.com/search?q=*", "https://*.google.com.hk/search?q=*", "https://*.google.com.au/search?q=*", "https://*.google.com.jp/search?q=*"],
        searchPath: "https://www.google.com/search?q={0}"
    },
    bing: { name: "bing", id: "slash.bing", title: "🍨 Bing", sites: ["https://*.bing.com/search?q=*"], searchPath: "https://cn.bing.com/search?q={0}" },
    baidu: { name: "baidu", id: "slash.baidu", title: "🍰 Baidu", sites: ["https://*.baidu.com/s?wd=*"], searchPath: "https://www.baidu.com/s?wd={0}" }
}

function onContextMenuClick(info, tab) {
    const keywords = getSearchKeyWords(tab.url);
    menuId = info.menuItemId;
    option = Object.values(options).find(e => e.id === menuId);
    if (!option) {
        throw new Error("No option defined")
    }

    const navigateTo = getNavigateTo(option, keywords);
    chrome.tabs.update(tab.id, { url: navigateTo }, () => {
        console.log("update succeed")
    },
    )
}

function getDocumentUrlPattern(name) {
    let patterns = [];
    for (const [key, value] of Object.entries(options)) {
        if (key !== name) {
            patterns = patterns.concat(value.sites);
        }
    }
    return patterns;
}

function getSearchKeyWords(urlstr) {
    url = new URL(urlstr);

    let keywords = "";
    if (url.searchParams.has("q")) {
        keywords = url.searchParams.get("q");
    } else if (url.searchParams.has("wd")) {
        keywords = url.searchParams.get("wd");
    }

    return keywords;
}

function getNavigateTo(option, keywords) {
    return format(option.searchPath, keywords);
}

function format() {
    if (arguments.length === 0) {
        return;
    }

    if (arguments.length === 1) {
        return arguments[0];
    }

    let str = arguments[0];
    const params = Array.prototype.slice.call(arguments, 1, arguments.length);

    for (i in params) {
        str = str.replace("{" + i + "}", params[i])
    }
    return str
}

function getOptions(callback) {
    chrome.storage.sync.get("options", ({ options }) => {
        callback(options);
    });
}


/* Main */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ options });
    getOptions((options) => {
        for (const [key, value] of Object.entries(options)) {
            let documentUrlPatterns = getDocumentUrlPattern(key);
            chrome.contextMenus.create({
                type: "normal",
                id: value.id,
                title: value.title,
                contexts: ["page"],
                documentUrlPatterns: documentUrlPatterns
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
            })
        }

        chrome.contextMenus.onClicked.addListener(
            onContextMenuClick
        );
    })
});