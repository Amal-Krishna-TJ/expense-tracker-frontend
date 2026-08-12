import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  imports: [RouterModule],
})
export class EmptyState {
  @Input() icon = 'fa-folder-open';

  @Input() title = 'Nothing Here';

  @Input() message = 'No data available.';

  @Input() buttonText = '';

  @Input() rlHref = '';
}
