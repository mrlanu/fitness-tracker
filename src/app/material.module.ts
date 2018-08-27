import {NgModule} from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  exports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule]
})
export class MaterialModule {}
