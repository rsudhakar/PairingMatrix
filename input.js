$(document).ready (
    function () {
        $("#pairing_text").keyup(displayPairNames);
        $("#regex").change(displayPairNames);

        $("#go").click(function() {
            var pairs = regexMatch();
            var model = convert(pairs);
            console.log(model);
            draw(model);
        });
    }
)

function displayPairNames() {
    var matches = regexMatch();
    console.log(matches);
    var matches_with_line_breaks = _.reduce(matches, function(text, v) {return text + v[0] + "," + v[1] + "\n"}, "");
    $("#pairing_names").val(matches_with_line_breaks);
}

function regexMatch() {
    var text = $("#pairing_text").val(),
        regexText = $("#regex").val(),
        pairs = [],
        regex = XRegExp(regexText);
    XRegExp.forEach(text, regex, function(match, i) {
        pairs.push([match[1].toLowerCase().trim(), match[2].toLowerCase().trim()]);
    });
    return pairs;
}

function convert(pairs) {
    //var pairs_count = _.countBy(pairs, function(pair){return pair});
    var unique_pairs_count = _.countBy(pairs, function(pair) {
        return _.sortBy(pair, function(person) {return person.toLowerCase().trim()})
    });
    var required_format = _.map(_.pairs(unique_pairs_count), function(model) {
        return _.flatten([model[0].split(','), model[1]])
    });
    return required_format;
}

function draw(model) {
    var playground = new PlayGround(".area");
    playground.load(model);

}