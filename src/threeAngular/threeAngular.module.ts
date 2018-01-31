import { NgModule } from '@angular/core';
import { TheMatrix } from './the-matrix/the-matrix';
import { TheToolbar } from './the-matrix/the-toolbar/the-toolbar';

@NgModule({
	declarations: [
		TheMatrix,TheToolbar
	],
	imports: [],
	exports: [
		TheMatrix
	]
})

export class ThreeAngular {}
