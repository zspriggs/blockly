// EXPERIMENT: give every property its own page, the way api-documenter does.
//
// Why a custom router: typedoc-plugin-markdown's `membersWithOwnFile` option
// only accepts Enum/Variable/Function/Class/Interface/TypeAlias -- "Property"
// is not a permitted value, so the option cannot express this. The plugin says
// as much in MemberRouter: "The concept of 'membersWithOwnFile' is being
// deprecated in favour of custom router implementations."
//
// The payoff is bigger than just the extra pages. In container.groups the
// theme branches on `group.children.every(child => router.hasOwnDocument(child))`:
//   - all children have their own page -> render a compact 2-column index
//   - otherwise                        -> render the wide table, or long-form
// So once properties are real pages, the class page switches to the narrow
// Name/Description index on its own. That removes the table-width problem at
// source rather than fighting it with CSS, and the full detail (type, sources,
// inherited from, overrides, defaults) lives on the property's own page where
// there is room for it.
//
// Three things have to line up for a property to get routed:
//   1. getPageKind() must return a PageKind -- the base returns undefined for
//      properties, and its own comment warns that children of an undefined
//      reflection never get documents.
//   2. kindsToString must map the kind, because MemberRouter.buildChildPages
//      tests `kindsToString.get(kind)` against its allow-list.
//   3. directories must map the kind, or the generated path has a hole in it.

import {PageKind, Reflection, ReflectionKind} from 'typedoc';
import {MemberRouter} from 'typedoc-plugin-markdown';

/** Kinds promoted from "anchor on the parent page" to "page of their own". */
const OWN_PAGE_KINDS = ReflectionKind.Property;

class PropertyPageRouter extends MemberRouter {
  constructor(renderer) {
    super(renderer);

    // These are class fields on the base, so they exist by the time super()
    // returns and can be amended in place.
    this.membersWithOwnFile = [...this.membersWithOwnFile, 'Property'];
    this.kindsToString.set(ReflectionKind.Property, 'Property');
    this.directories.set(ReflectionKind.Property, 'properties');
  }

  getPageKind(target) {
    const inherited = super.getPageKind(target);
    if (inherited) return inherited;

    if (target instanceof Reflection && target.kindOf(OWN_PAGE_KINDS)) {
      return PageKind.Reflection;
    }

    return undefined;
  }

  /**
   * Nest property pages under their owner instead of at the output root.
   *
   * The inherited implementation has no branch for a member whose parent is a
   * Class or Interface, so it falls through to `<Owner>/properties` -- which
   * lands a directory per class at the top level, next to `classes/` itself.
   * Re-prefixing with the owner's own directory gives
   * `classes/FieldCheckbox/properties/DEFAULT_VALUE.md`.
   */
  getReflectionDirectory(reflection) {
    if (reflection.kindOf(OWN_PAGE_KINDS) && reflection.parent) {
      const ownerDir = this.getIdealBaseName(reflection.parent).replace(
        /\/[^/]+$/,
        '',
      );
      const owner = this.getReflectionAlias(reflection.parent);
      const dir = this.directories.get(reflection.kind);
      return ownerDir ? `${ownerDir}/${owner}/${dir}` : `${owner}/${dir}`;
    }
    return super.getReflectionDirectory(reflection);
  }
}

export function load(app) {
  app.renderer.defineRouter('property-pages', PropertyPageRouter);
}
