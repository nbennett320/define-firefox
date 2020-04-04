"use strict"
const menus = browser.contextMenus

const getDictUrl = (selectionText, key) => {
    return `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${selectionText}?key=${key}`
}

const getThesUrl = (selectionText, key) => {
    return `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${selectionText}?key=${key}`
}

const handleDict = dict => {
    const defs = dict.map(el => el.shortdef)
    console.log(defs)
}

const handleDefine = async (info, tab, key) => {
    const { selectionText } = info
    const url = getDictUrl(selectionText, key)
    console.log("Define: ", selectionText)
    await fetch(url)
        .then(res => {
            return res.json()
        }).then(data => {
            handleDict(data)
        })
}

const handleSyn = thes => {
    const words = thes.syns
    console.log(words)
}

const handleFindSynonym = async (info, tab, key) => {
    const { selectionText } = info
    const url = getThesUrl(selectionText, key)
    console.log("Synonyms for: ", selectionText)
    await fetch(url)
        .then(res => {
            return res.json()
        }).then(data => {
            handleDict(data)
        })
}

const createMenus = () => {
    menus.create({
        id: "define-selection",
        title: "Define selection",
        contexts: ["selection"],
    })
    
    menus.create({
        id: "synonym-selection",
        title: "Synonym for selection",
        contexts: ["selection"],
    })
}

const getKeys = async () => {
    const keys = await fetch(browser.runtime.getURL("keys.json"))
        .then(res => res.json())
        .then(data => data)
    return keys
}

const main = async () => {
    const keys = await getKeys()
    createMenus()
    menus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "define-selection") {
            handleDefine(info, tab, keys["dictionary"])
        } 
        else if (info.menuItemId === "synonym-selection") {
            handleFindSynonym(info, tab, keys["thesaurus"])
        }
    })
}

main()