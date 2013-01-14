function PlayGround(selector) {
    this.el = null;
    this.centerX = 400;
    this.centerY = 350;
    this.radius = 300;
    this.selector = selector;

    this.pairingData = [];
    this.playersData = [];

    this.connectionScale = d3.scale.linear()
        .domain([0,40])
        .range([0,25]);

    this.init = function() {
        this.el = d3.select(this.selector);
    };

    this.load = function(pairingData) {
        this.pairingData = pairingData;
        this.playersData = this.getPlayerNames(pairingData);
        this.clear();
        this.setGround();
        this.setPairing();
        this.setPlayers();
    };

    this.clear = function() {
        $(this.selector).children().remove();
    }

    this.setPairing = function() {
        var playground = this;
        this.el.selectAll(".connect")
            .data(playground.pairingData)
            .enter().append("path")
            .attr("class","connect")
            .attr("d", function(d) {
                var fromIndex = _.indexOf(playground.playersData, d[0]),
                    fromCoordinates = playground.getPlayerCoordinates(fromIndex),
                    toIndex = _.indexOf(playground.playersData, d[1]),
                    toCoordinates = playground.getPlayerCoordinates(toIndex);
                return "M " + fromCoordinates.x + " " + fromCoordinates.y + "Q 400 350 " +
                    toCoordinates.x + " " + toCoordinates.y;
            })
            .attr("fill","none")
            .attr("stroke","#DD1031")
            .attr("stroke-width", function(d) {return playground.connectionScale(d[2])})
            .attr("stroke-opacity",0.2)
            .attr("data-from", function(d) {return d[0]})
            .attr("data-to", function(d) {return d[1]})
            .on("mouseover", function(d) {
                d3.select(this).attr("stroke-opacity",1);
                d3.select("#"+d[0]).attr("fill-opacity",1);
                d3.select("#"+d[1]).attr("fill-opacity",1);
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("stroke-opacity",0.2);
                d3.select("#"+d[0]).attr("fill-opacity",0.5);
                d3.select("#"+d[1]).attr("fill-opacity",0.5);
            })
        //.exit().remove();
    };

    this.setGround = function() {
        this.el.append("circle")
            .attr("cx", this.centerX)
            .attr("cy", this.centerY)
            .attr("r", this.radius)
            .style("stroke", '#0B5F0B')
            .style("fill-opacity", 0.1);
    };

    this.setPlayers = function() {
        var playground = this;
        var players = this.el.selectAll(".players")
            .data(playground.playersData)
            .enter()
            .append("g");
        players.append("circle")
            .attr("cx", function(d,i) {return playground.getPlayerCoordinates(i).x})
            .attr("cy", function(d,i) {return playground.getPlayerCoordinates(i).y})
            .attr("r", 20)
            .attr("fill", "#DD1031")
            .attr("fill-opacity", 0.2)
            .attr("stroke", "#0B5F0B")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1)
            .attr("z-index",10)
            .attr("class","player")
            .attr("id", function(d) {return d})
            .on("mouseover", function(d) {
                playground.highlightPairing(d);
                d3.select(this).attr("fill-opacity", 1);
            })
            .on("mouseout", function(d) {
                playground.maskPairing(d);
                d3.select(this).attr("fill-opacity", 0.2);
            });

        players.append("text")
            .attr("class","player_names")
            .text(function(d) {return d})
            .attr("x", function(d,i) {return playground.getPlayerCoordinates(i).x - 5})
            .attr("y", function(d,i) {return playground.getPlayerCoordinates(i).y - 26})
            .attr("fill","#000000");
    };

    this.highlightPairing = function(person) {
        d3.selectAll(".connect")
            .attr("stroke-opacity", function(d) {
                var elem = d3.select(this);
                return (elem.attr("data-from") == person || elem.attr("data-to") == person) ? 1 : 0.2
            });
    };

    this.maskPairing= function(person) {
        d3.selectAll(".connect")
            .attr("stroke-opacity", 0.2);
    };

    this.getPlayerCoordinates = function(index) {
        var playground = this;
        var distanceInDegrees = 2*Math.PI/playground.playersData.length;
        return {
            x: (playground.radius * Math.sin(distanceInDegrees*index) + playground.centerX),
            y: (playground.radius * Math.cos(distanceInDegrees*index) + playground.centerY)
        }
    };

    this.getPlayerNames = function(pairingData) {
        var playerNames = [];
        _.each(pairingData, function(data) {
            playerNames.push(data[0]);
            playerNames.push(data[1]);
        });
        return _.sortBy(_.uniq(playerNames), function(d) { return d });
//        return _.countBy(playerNames, function(name) {return name})
    }

    this.init();
}
