import { NgModule } from '@angular/core';
import { TheMatrix } from './the-matrix/the-matrix';
import { TheToolbar } from './the-matrix/the-toolbar/the-toolbar';

import { TheArchitect } from './the-matrix/the-architect.service';

@NgModule({
	declarations: [
		TheMatrix,TheToolbar
	],
	providers: [
		TheArchitect,
	],
	imports: [],
	exports: [
		TheMatrix
	]
})

export class ThreeAngular {}
