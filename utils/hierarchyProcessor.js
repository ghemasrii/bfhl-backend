function isValidEdge(edge) {
    if (!edge || typeof edge !== "string") return false;

    const trimmed = edge.trim();

    if (!/^[A-Z]->[A-Z]$/.test(trimmed)) return false;

    const [parent, child] = trimmed.split("->");

    if (parent === child) return false;

    return true;
}

function calculateDepth(node, treeMap) {
    if (!treeMap[node] || treeMap[node].length === 0) {
        return 1;
    }

    let maxDepth = 0;

    for (const child of treeMap[node]) {
        maxDepth = Math.max(maxDepth, calculateDepth(child, treeMap));
    }

    return maxDepth + 1;
}

function buildNestedTree(node, treeMap) {
    let result = {};

    if (!treeMap[node] || treeMap[node].length === 0) {
        return {};
    }

    for (const child of treeMap[node]) {
        result[child] = buildNestedTree(child, treeMap);
    }

    return result;
}

function detectCycle(node, treeMap, visited, stack) {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const child of treeMap[node] || []) {
        if (detectCycle(child, treeMap, visited, stack)) {
            return true;
        }
    }

    stack.delete(node);
    return false;
}

function buildHierarchyResponse(data) {
    const invalid_entries = [];
    const duplicate_edges = [];

    const edgeSet = new Set();
    const childParentMap = {};
    const treeMap = {};

    for (let raw of data) {
        const edge = raw.trim();

        if (!isValidEdge(edge)) {
            invalid_entries.push(raw);
            continue;
        }

        if (edgeSet.has(edge)) {
            if (!duplicate_edges.includes(edge)) {
                duplicate_edges.push(edge);
            }
            continue;
        }

        const [parent, child] = edge.split("->");

        if (childParentMap[child]) {
            continue;
        }

        childParentMap[child] = parent;
        edgeSet.add(edge);

        if (!treeMap[parent]) treeMap[parent] = [];
        if (!treeMap[child]) treeMap[child] = [];

        treeMap[parent].push(child);
    }

    const allNodes = new Set([
        ...Object.keys(treeMap),
        ...Object.keys(childParentMap)
    ]);

    const roots = [];

    for (const node of allNodes) {
        if (!childParentMap[node]) {
            roots.push(node);
        }
    }

    roots.sort();

    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = "";
    let maxDepthFound = 0;

    for (const root of roots) {
        const visited = new Set();
        const stack = new Set();

        const hasCycle = detectCycle(root, treeMap, visited, stack);

        if (hasCycle) {
            total_cycles++;

            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });

            continue;
        }

        const nested = {};
        nested[root] = buildNestedTree(root, treeMap);

        const depth = calculateDepth(root, treeMap);

        total_trees++;

        if (
            depth > maxDepthFound ||
            (depth === maxDepthFound && root < largest_tree_root)
        ) {
            maxDepthFound = depth;
            largest_tree_root = root;
        }

        hierarchies.push({
            root,
            tree: nested,
            depth
        });
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = {
    buildHierarchyResponse
};