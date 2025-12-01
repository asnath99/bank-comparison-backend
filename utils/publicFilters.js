const { Bank } = require('../models');

function isIncludeOf(inc, ParentModel, alias) {
  return (
    inc?.model === ParentModel ||
    inc?.model?.name === ParentModel?.name ||
    inc?.association?.target === ParentModel ||
    inc?.association?.target?.name === ParentModel?.name ||
    (!!alias && (inc?.as === alias || inc?.association?.as === alias))
  );
}

function addActiveParentFilterDeep(include, ParentModel, alias, attrs) {
  if (!include) return include;

  if (Array.isArray(include)) {
    return include.map((i) => addActiveParentFilterDeep(i, ParentModel, alias, attrs));
  }

  const inc = { ...include };
  if (isIncludeOf(inc, ParentModel, alias)) {
    inc.required = true;
    inc.where = { ...(inc.where || {}), is_active: true };
    if (!inc.attributes && Array.isArray(attrs)) inc.attributes = attrs;
  }

  if (inc.include) {
    inc.include = addActiveParentFilterDeep(inc.include, ParentModel, alias, attrs);
  }
  return inc;
}

/**
 * Rend l'include "parent actif" obligatoire :
 * - Si un include du parent existe déjà → renforce (required + is_active=true).
 * - Sinon → ajoute un include minimal du parent.
 */
function withActiveParent(include = [], ParentModel, { alias, attrs = ['id', 'name'] } = {}) {
  const arr = Array.isArray(include) ? include : [include];

  // vérifie s'il y'a déjà un include du parent
  const hasParent = arr.some((inc) => isIncludeOf(inc, ParentModel, alias));

  if (hasParent) {
    return addActiveParentFilterDeep(arr, ParentModel, alias, attrs);
  }

  // Sinon  ajoute un include minimal du parent
  const parentInclude = {
    model: ParentModel,
    required: true,
    where: { is_active: true },
    attributes: attrs,
    ...(alias ? { as: alias } : {}),
  };

  return [parentInclude, ...arr];
}

// Spécialisation pour Bank
function withActiveBank(include = [], attrs = ['id', 'name'], opts = {}) {

    return withActiveParent(include, Bank, { attrs, alias: opts.alias });
}

module.exports = { withActiveParent, withActiveBank };
