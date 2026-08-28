import {PageKind, Reflection, ReflectionKind} from 'typedoc';
import {MemberRouter} from 'typedoc-plugin-markdown';

/** Kinds promoted from "anchor on the parent page" to "page of their own". */
const OWN_PAGE_KINDS = ReflectionKind.Property;

/** 
 *  Custom router that give properties their own pages, and nests those pages
 *  under their owner. 
 */
class PropertyPageRouter extends MemberRouter {
  constructor(renderer) {
    super(renderer);

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
   *  Nest property pages under their owner instead of at the output root.
   *  @param {Reflection} reflection A TypeDoc reflection
   *  @returns {any} The reflection's directory, with owner's directory prepended
   *  if the reflection is a kind specified OWN_PAGE_KINDS
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
