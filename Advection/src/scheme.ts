import { AcdiScheme } from "./scheme/acdi";
import { CentralScheme } from "./scheme/central";
import { CipScheme } from "./scheme/cip";
import { DonorCellScheme } from "./scheme/donorCell";
import { EnoScheme } from "./scheme/eno";
import { KawamuraKuwaharaScheme } from "./scheme/kawamuraKuwahara";
import { LaxWendroffScheme } from "./scheme/laxWendroff";
import { MusclScheme } from "./scheme/muscl";
import { QuickScheme } from "./scheme/quick";
import { QuickestScheme } from "./scheme/quickest";
import { ThincScheme } from "./scheme/thinc";
import { WenoScheme } from "./scheme/weno";

const schemeList = [
  AcdiScheme,
  CentralScheme,
  CipScheme,
  DonorCellScheme,
  EnoScheme,
  KawamuraKuwaharaScheme,
  LaxWendroffScheme,
  MusclScheme,
  QuickScheme,
  QuickestScheme,
  ThincScheme,
  WenoScheme,
] as const;

type OneOfSchemes = InstanceType<(typeof schemeList)[number]>;

export class Scheme {
  private counter: number;
  private currentScheme: OneOfSchemes;

  public constructor(specifiedScheme: string | null, length: number, nitems: number) {
    if (specifiedScheme !== null) {
      for (const [counter, scheme] of schemeList.entries()) {
        const s = new scheme(length, nitems);
        if (s.label.toLowerCase() === specifiedScheme.toLowerCase()) {
          this.counter = counter;
          this.currentScheme = s;
          return;
        }
      }
      throw new Error(`Unknown scheme "${specifiedScheme}" is specified: use default`);
    }
    this.counter = 0;
    const scheme = schemeList[this.counter];
    this.currentScheme = new scheme(length, nitems);
  }

  public toPrev(): void {
    this.counter = (this.counter + schemeList.length - 1) % schemeList.length;
    this.currentScheme = new schemeList[this.counter](
      this.currentScheme.getLength(),
      this.currentScheme.getNitems(),
    );
  }

  public toNext(): void {
    this.counter = (this.counter + schemeList.length + 1) % schemeList.length;
    this.currentScheme = new schemeList[this.counter](
      this.currentScheme.getLength(),
      this.currentScheme.getNitems(),
    );
  }

  public flipVelocity(): void {
    this.currentScheme.flipVelocity();
  }

  public integrate(): void {
    this.currentScheme.integrate();
  }

  public getArray(): Readonly<Array<number>> {
    return this.currentScheme.getArray();
  }

  public getLabel(): string {
    return this.currentScheme.label;
  }
}
