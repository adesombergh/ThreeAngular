import { NgModule } from '@angular/core';
import { ModEditorComponent } from './mod-editor/mod-editor';
import { ToolbarComponent } from './toolbar/toolbar';
@NgModule({
	declarations: [ModEditorComponent,
    ToolbarComponent],
	imports: [],
	exports: [ModEditorComponent,
    ToolbarComponent]
})
export class ComponentsModule {}
