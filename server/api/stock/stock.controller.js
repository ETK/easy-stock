/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stocks              ->  index
 * POST    /api/stocks              ->  create
 * GET     /api/stocks/:id          ->  show
 * PUT     /api/stocks/:id          ->  update
 * DELETE  /api/stocks/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Stock = require('./stock.model');
var yahooFinance = require('yahoo-finance');
var moment = require('moment');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Stocks
exports.index = function(req, res) {
  Stock.getSnapshots(function(err, snapshots){
    res.status(200).json(snapshots);
  })
};

exports.getSnapSymbol = function (req, res) {
  yahooFinance.snapshot({symbol: req.params.symbol}, function (err, snapshot) {
    _.forOwn(snapshot, function (val, key) {
      if (!val || _.isObject(val)) {
        delete snapshot[key];
      }
    });
    res.status(200).json(snapshot);
  });
};

exports.getHistoStock = function (req, res) {
  var to = moment(req.body.to).format('YYYY-MM-DD');
  var from = moment(req.body.from).subtract(365, 'days').format('YYYY-MM-DD');
  yahooFinance.historical({
    symbol: req.body.symbol,
    from: req.body.from,
    to: req.body.to
  }, function (err, quotes) {
    if(quotes){
      res.status(200).json(quotes);
    }else(
      handleError(res, 404)
    )
  });
};
// Gets a single Stock from the DB
exports.show = function(req, res) {
  Stock.getSnapshot(req.params.id, function(err, snapshot){
    if(snapshot){
      res.status(200).json(snapshot);
    }else{
      handleError(res, 404);
    }
  })
};

// Creates a new Stock in the DB
exports.create = function(req, res) {
  Stock.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};


// Deletes a Stock from the DB
exports.destroy = function(req, res) {
  Stock.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
