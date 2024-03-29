import { danger, warn, fail } from 'danger';

// No PR is too small to include a description of why you made a change
if (danger.github.pr.body.length < 10) {
  fail('Please include a description of your PR changes.');
}
