const axios = require('axios');
const mongoose = require('mongoose');
const contest = require('../models/contest');

module.exports.home = (req, res) => {
    return res.render('home', {
        'topicsDict' : {},
        "userId": ""
    });
}

module.exports.createDatabase = async (req, res) => {
    var allQuestions = await axios.get('https://codeforces.com/api/problemset.problems');
    allQuestions = allQuestions.data.result.problems;
    var contestsDict = {};
    for (var i = 0; i < allQuestions.length; i++) {
        var problem = allQuestions[i];
        var contestId = problem['contestId'];
        var index = problem['index'];
        var tags = problem['tags'];
        if (contestId in contestsDict) {
            contestsDict[contestId][0].push(index);
            contestsDict[contestId][1].push(tags);
        } else {
            contestsDict[contestId] = [[], []];
            contestsDict[contestId][0].push(index);
            contestsDict[contestId][1].push(tags);
        }
    }
    var contestIds = Object.keys(contestsDict);
    for (var i = 0; i < contestIds.length; i++) {
        var x = await contest.findOne({ contestId: contestIds[i] });
        if (!x) {
            var y = await contest.create({
                "contestId": contestIds[i],
                "index": contestsDict[contestIds[i]][0],
                "tags": contestsDict[contestIds[i]][1]
            });
        }
    }
}

module.exports.fetchData = async (req, res) => {
    var contests = JSON.parse(req.params.obj).contests;
    var userId = JSON.parse(req.params.obj).userId;
    var topicsDict = {};
    for (var i = 0; i < contests.length; i++) {
        var contestData = await contest.findOne({ "contestId": contests[i] });
        if (contestData) {
            var index = contestData['index'];
            var tags = contestData['tags'];
            for (var j = 0; j < tags.length; j++) {
                for (var k = 0; k < tags[j].length; k++) {
                    if (tags[j][k] in topicsDict) {
                        topicsDict[tags[j][k]].push('https://codeforces.com/contest/' + contests[i] + '/problem/' + index[j]);
                    } else {
                        topicsDict[tags[j][k]] = [];
                        topicsDict[tags[j][k]].push('https://codeforces.com/contest/' + contests[i] + '/problem/' + index[j]);
                    }
                }
            }
        }
    }
    return res.status(200).json({
        'topicsDict' : topicsDict,
        "userId": userId
    });
}