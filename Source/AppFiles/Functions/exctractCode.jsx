export const exctractCode = (mainCode) => {
    const { code, originalUrl, tabId, grabbetItems, allNodes, allTagsOfThisType, allAvailableTagsAtAll } = JSON.parse(mainCode);

    return {
        code,
        originalUrl,
        tabId,
        grabbetItems,
        allNodes,
        allTagsOfThisType,
        allAvailableTagsAtAll
    }
}