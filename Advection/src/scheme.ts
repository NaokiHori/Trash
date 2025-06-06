import { AcdiScheme } from "./scheme/acdi";
import { CentralScheme } from "./scheme/central";
import { DonorCellScheme } from "./scheme/donorCell";
import { KawamuraKuwaharaScheme } from "./scheme/kawamuraKuwahara";
import { LaxWendroffScheme } from "./scheme/laxWendroff";
import { MusclScheme } from "./scheme/muscl";
import { QuickScheme } from "./scheme/quick";
import { QuickestScheme } from "./scheme/quickest";
import { ThincScheme } from "./scheme/thinc";

const schemeList = [
  AcdiScheme,
  CentralScheme,
  DonorCellScheme,
  KawamuraKuwaharaScheme,
  LaxWendroffScheme,
  MusclScheme,
  QuickScheme,
  QuickestScheme,
  ThincScheme,
] as const;

type OneOfSchemes = InstanceType<(typeof schemeList)[number]>;

export class Scheme {
  private _counter: number;
  private _currentScheme: OneOfSchemes;

  public constructor(length: number, nitems: number) {
    this._counter = 0;
    const scheme = schemeList[this._counter];
    this._currentScheme = new scheme(length, nitems);
  }

  public toPrev() {
    this._counter = (this._counter + schemeList.length - 1) % schemeList.length;
    this._currentScheme = new schemeList[this._counter](
      this._currentScheme.length,
      this._currentScheme.nitems,
    );
  }

  public toNext() {
    this._counter = (this._counter + schemeList.length + 1) % schemeList.length;
    this._currentScheme = new schemeList[this._counter](
      this._currentScheme.length,
      this._currentScheme.nitems,
    );
  }

  public flipVelocity() {
    this._currentScheme.flipVelocity();
  }

  public integrate() {
    this._currentScheme.integrate();
  }

  public getArray(): Readonly<Array<number>> {
    return this._currentScheme.getArray();
  }

  public getLabel(): string {
    return this._currentScheme.label;
  }
}
