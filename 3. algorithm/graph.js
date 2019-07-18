class Vertex {
    #id;
    #object;

    constructor(id, object) {
        this.#id = id;
        this.#object = object;
    }

    get id() {
        return this.#id;
    }

    get object() {
        return this.#object;
    }
}

class Edge {
    #startVertex;
    #finishVertex;
    #weight;
    #directed;

    constructor(startVertex, finishVertex, weight, directed) {
        this.#startVertex = startVertex;
        this.#finishVertex = finishVertex;
        this.#weight = weight;
        this.#directed = directed;
    }

    get startVertex() {
        return this.#startVertex;
    }

    get finishVertex() {
        return this.#finishVertex;
    }

    get weight() {
        return this.#weight;
    }

    get directed() {
        return this.#directed
    }
}

class Graph {
    static #OBJECT = 'object';
    static #WEIGHT = 'weight';
    static #NEIGHBOURS = 'neighbours';
    static #DIRECTION = 'direction';
    static #START = 'start';
    static #FINISH = 'finish';
    #vertexList;
    #directed;

    constructor(directed) {
        this.#vertexList = {};
        this.#directed = directed;
    }

    getVertex(id) {
        if (this.#vertexList.hasOwnProperty(id)) {
            return this.#vertexList[id][Graph.#OBJECT];
        } else {
            return null;
        }
    }

    getEdge(id1, id2) {
        if (this.#vertexList.hasOwnProperty(id1) && this.#vertexList.hasOwnProperty(id2) && this.#vertexList[id1][Graph.#NEIGHBOURS].hasOwnProperty(id2) && id1 !== id2) {
            let startVertexId = this.#vertexList[id1][Graph.#NEIGHBOURS][id2].direction === Graph.#FINISH ? id1 : id2;
            let endVertexId = id1 === startVertexId ? id2 : id1;
            return new Edge(this.#vertexList[startVertexId][Graph.#OBJECT], this.#vertexList[endVertexId][Graph.#OBJECT],
                this.#vertexList[id1][Graph.#NEIGHBOURS][id2][Graph.#WEIGHT], this.#directed);
        } else {
            return null;
        }
    }

    getNeighbours(id) {
        let neighbours = [];
        if (this.#vertexList.hasOwnProperty(id)) {
            for (let listItemId in this.#vertexList) {
                if (this.#vertexList.hasOwnProperty(listItemId) && listItemId !== id) {
                    for (let neighbourItemId in this.#vertexList[listItemId][Graph.#NEIGHBOURS]) {
                        if (this.#vertexList[listItemId][Graph.#NEIGHBOURS].hasOwnProperty(neighbourItemId) && id === neighbourItemId) {
                            neighbours.push(this.#vertexList[listItemId].object);
                        }
                    }
                }
            }
        }
        return neighbours;
    }

    addVertex(id, object) {
        if (!this.#vertexList.hasOwnProperty(id)) {
            this.#vertexList[id] = {};
            this.#vertexList[id][Graph.#OBJECT] = new Vertex(id, object);
            this.#vertexList[id][Graph.#NEIGHBOURS] = {};
        }
    }

    addEdge(id1, id2, weight, directed) {
        if (this.#directed === directed && this.#vertexList.hasOwnProperty(id1) && this.#vertexList.hasOwnProperty(id2)) {
            let vertex1neighbours = this.#vertexList[id1][Graph.#NEIGHBOURS];
            vertex1neighbours[id2] = {};
            vertex1neighbours[id2][Graph.#WEIGHT] = weight;
            if (directed) {
                vertex1neighbours[id2][Graph.#DIRECTION] = Graph.#FINISH;
            }

            let vertex2neighbours = this.#vertexList[id2][Graph.#NEIGHBOURS];
            vertex2neighbours[id1] = {};
            vertex2neighbours[id1][Graph.#WEIGHT] = weight;
            if (directed) {
                vertex2neighbours[id1][Graph.#DIRECTION] = Graph.#START;
            }
        }
    }

    removeVertex(id) {
        if (this.#vertexList.hasOwnProperty(id)) {
            for (let listItemId in this.#vertexList) {
                if (this.#vertexList.hasOwnProperty(listItemId)) {
                    if (listItemId === id) {
                        delete this.#vertexList[id];
                    } else {
                        for (let neighbourItemId in this.#vertexList[listItemId][Graph.#NEIGHBOURS]) {
                            if (this.#vertexList[listItemId][Graph.#NEIGHBOURS].hasOwnProperty(neighbourItemId)) {
                                if (neighbourItemId === id) {
                                    delete this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    removeEdge(id1, id2) {
        if (this.#vertexList.hasOwnProperty(id1) && this.#vertexList.hasOwnProperty(id2)) {
            for (let listItemId in this.#vertexList) {
                if (this.#vertexList.hasOwnProperty(listItemId)) {
                    if (listItemId === id1 || listItemId === id2) {
                        let vertexId1 = listItemId === id1 ? id1 : id2;
                        let vertexId2 = listItemId === id1 ? id2 : id1;
                        for (let neighbourItemId in this.#vertexList[vertexId1][Graph.#NEIGHBOURS]) {
                            if (this.#vertexList[vertexId1][Graph.#NEIGHBOURS].hasOwnProperty(neighbourItemId)) {
                                if (neighbourItemId === vertexId2) {
                                    delete this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    reverse() {
        if (this.#directed) {
            for (let listItemId in this.#vertexList) {
                if (this.#vertexList.hasOwnProperty(listItemId)) {
                    for (let neighbourItemId in this.#vertexList[listItemId][Graph.#NEIGHBOURS]) {
                        if (this.#vertexList[listItemId][Graph.#NEIGHBOURS].hasOwnProperty(neighbourItemId)) {
                            let direction = this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId].direction;
                            this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId].direction = direction === Graph.#START ? Graph.#FINISH : Graph.#START;
                        }
                    }
                }
            }
        }
    }

    getAdjacencyMatrix() {
        let adjacencyMatrix = [];
        let vertexIds = [];
        for (let listItemId in this.#vertexList) {
            if (this.#vertexList.hasOwnProperty(listItemId)) {
                vertexIds.push(listItemId);
            }
        }
        for (let rowId of vertexIds) {
            let adjacencyMatrixRow = [];
            for (let columnId of vertexIds) {
                if (this.#vertexList[rowId][Graph.#NEIGHBOURS].hasOwnProperty(columnId)) {
                    adjacencyMatrixRow.push(this.#vertexList[rowId][Graph.#NEIGHBOURS][columnId].weight)
                } else {
                    adjacencyMatrixRow.push(0);
                }
            }
            adjacencyMatrix.push(adjacencyMatrixRow)
        }
        return adjacencyMatrix;
    }

    getEdgeWeight(id1, id2) {
        return this.getEdge(id1, id2).weight;
    }

    getSubgraph(vertexIdArray) {
        let subgraphVertexList = {};
        for (let listItemId in this.#vertexList) {
            if (this.#vertexList.hasOwnProperty(listItemId) && vertexIdArray.includes(listItemId)) {
                subgraphVertexList[listItemId] = {};
                subgraphVertexList[listItemId][Graph.#OBJECT] = this.#vertexList[listItemId].object;
                subgraphVertexList[listItemId][Graph.#NEIGHBOURS] = {};
                for (let neighbourItemId in this.#vertexList[listItemId][Graph.#NEIGHBOURS]) {
                    if (this.#vertexList[listItemId][Graph.#NEIGHBOURS].hasOwnProperty(neighbourItemId) && vertexIdArray.includes(neighbourItemId)) {
                        subgraphVertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId] = {};
                        subgraphVertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId][Graph.#WEIGHT] =
                            this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId].weight;
                        subgraphVertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId][Graph.#DIRECTION] =
                            this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId].direction;
                    }
                }
            }
        }
        let subgraph = new Graph(this.#directed);
        subgraph.#vertexList = subgraphVertexList;
        return subgraph;
    }

    getShortestPath(id1, id2) {
        if (this.#vertexList.hasOwnProperty(id1) && this.#vertexList.hasOwnProperty(id2)) {
            let edges = {};
            let dist = {};
            let parents = {};
            for (let listItemId in this.#vertexList) {
                if (this.#vertexList.hasOwnProperty(listItemId)) {
                    edges[listItemId] = {};
                    for (let neighbourItemId in this.#vertexList[listItemId][Graph.#NEIGHBOURS]) {
                        if (this.#vertexList[listItemId][Graph.#NEIGHBOURS].hasOwnProperty(neighbourItemId)
                            && this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId].direction === Graph.#FINISH) {
                            edges[listItemId][neighbourItemId] = this.#vertexList[listItemId][Graph.#NEIGHBOURS][neighbourItemId].weight;
                        }
                    }
                    dist[listItemId] = listItemId === id1 ? 0 : Number.MAX_VALUE;
                }
            }
            for (let relaxRound in edges) {
                if (edges.hasOwnProperty(relaxRound)) {
                    for (let startVertex in edges) {
                        if (edges.hasOwnProperty(startVertex)) {
                            for (let finishVertex in edges[startVertex]) {
                                if (edges[startVertex].hasOwnProperty(finishVertex) && dist[finishVertex] > dist[startVertex] + edges[startVertex][finishVertex]) {
                                    dist[finishVertex] = dist[startVertex] + edges[startVertex][finishVertex];
                                    parents[finishVertex] = startVertex;
                                }
                            }
                        }
                    }
                }
            }
            let shortestPath = [];
            let currentVertex = id2;
            while(parents[currentVertex] !== undefined) {
                shortestPath.unshift(currentVertex);
                currentVertex = parents[currentVertex];
            }
            shortestPath.unshift(currentVertex);
            return shortestPath;
        }
    }
}