import { NgModule } from '@angular/core';
import { TheMatrix } from './the-matrix/the-matrix';
import { TheToolbar } from './the-matrix/the-toolbar/the-toolbar';
import { LeftMenuComponent } from './the-matrix/left-menu/left-menu';
import { RightMenuComponent } from './the-matrix/right-menu/right-menu';

import { TheArchitect } from './the-matrix/the-architect.service';

@NgModule({
	declarations: [
		TheMatrix,TheToolbar,LeftMenuComponent,RightMenuComponent
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
