import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = component => {
  if(component.editForm?.dirty) {
    return confirm("There are unsaved changes in your personal form");
  }
  
  return true;
};
