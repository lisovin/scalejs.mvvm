/*global define*/
define([
    'knockout'
], function (
    ko
) {
    'use strict';

    function cloneNodes(nodesArray, shouldCleanNodes) {
        return nodesArray.map(function (node) {
            var clonedNode = node.cloneNode(true);
            return shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode;
        });
    }

    return {
        cloneNodes: cloneNodes
    };
});
