import { NgModule } from '@angular/core';
import { TheMatrix } from './the-matrix/the-matrix';
import { TheToolbar } from './the-matrix/the-toolbar/the-toolbar';

import { TheEditorService } from './the-matrix/the-editor.service';

@NgModule({
	declarations: [
		TheMatrix,TheToolbar
	],
	providers: [
		TheEditorService
	],
	imports: [],
	exports: [
		TheMatrix
	]
})

export class ThreeAngular {}
