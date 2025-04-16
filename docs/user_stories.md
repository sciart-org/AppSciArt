# AppSciArt - User stories

## System user roles

* **Guest**: Un-authenticated user.
* Authenticated user. They could have (many) different roles:
  * **Participants**: Default role. Even though called "participant", it does not imply that it is participating in some hackathon, but could do it.
  * **Facilitators**: Team staff (administrators). They could be either **Coordinators** or **Assistants**.
  * **Inspiring Scientists**: Creators of SciArt seeds. 
  * **Designer**: Creators of a SciArt methodology (e.g. ASTER+S).
  * **Evaluator**: They evaluate different SciArt flowers.

There exists two temporary roles during the hackathon process:
  * **Group voice**: Inside an exploring group, the participant that will be responsible for uploading the conceptual map, and communicating with the facilitators (if necessary)
  * **Speaker**: Inside a co-creation team, the participant that will be responsible for delivering the complete flower, and communicating with the facilitators (if necessary)

If the term "user" is used, all users (authenticated or not) should be able to perform the user story.

SciArt seeds, flowers and fruits will be referred as just seeds, flowers and fruits.

## User stories

### US-1: Log in

As a guest, I want to log into my already existing account in order to access all the functionalities of AppSciArt.

This user story has several possible entry points:

1. Entry point. The guest could click the "Log in" button from:
   * The Home screen
   * Some product collection
   * Some product details 
   * The registration form in [Registering](#us-2-registering)
2. The guest introduces his/her user credentials
3. The user is redirected to the Home screen

### US-2: Registering

As a guest, I want to create an account in order to access all the functionalities of AppSciArt.

This user story has several user workflows.

#### US-2A: Direct registration

1. The guest clicks the "Register" button in the Home screen
2. The guest fills the registration form
3. The guest clicks the "Register" button below the form
4. The participant is prompted to join a hackathon. See [Joining a hackathon](#us-3-joining-a-hackathon)

#### US-2B: Quick registration

1. The guest introduces his/her email address in the quick registration form in the Home screen
2. The guest clicks the "Join now" button
3. An email is sent for the guest to [complete the registration](#us-2c-complete-registration)

#### US-2C: Complete registration

1. The guest enters his/her email inbox
2. The guest clicks the "Complete your registration" email sent by AppSciArt
3. The guest clicks the "Complete my registration" button in the email
4. The guest is redirected to the registration form
5. The guest fills the missing values of the registration form
6. The guest clicks the "Register" button
7. The participant is prompted to join a hackathon. See [Joining a hackathon](#us-3-joining-a-hackathon)

### US-3: Joining a hackathon

As a participant, I want to be able to join a hackathon, in order to participate in it.

This user story has several possible user workflows.

#### US-3A: Unregistered join

1. The guest accesses the hackathon list screen
2. The guest clicks the "Join hackathon" button of the hackathon he/she wants to join
3. The guest fills a quick registration + joining form (minimal information)
4. The guest is prompted to explore seed collections
5. An email is sent for the guest to [complete the registration](#us-2c-complete-registration)

#### US-3B: Join from [direct registration](#us-2a-direct-registration) or [complete registration](#us-2c-complete-registration)

  1. The participant may get more information about the methodology format by clicking the "What is a hackathon?" button
  2. If the participant does not want to join:
    
      i. The participant clicks the "Maybe later" button

      ii. The participant is prompted to explore previous editions or get more information about the hackathon format

  3. If the participant wants to join:

      i. The participant clicks the hackathon he/she wants to join

      ii. The participant clicks the "Join this hackathon" button

      iii. The participant fills the joining form

      iv. The participant is prompted to [explore seed collections](#us-4-explore-sciart-products-collections)

#### US-3C: Join from [hackathon list](#us-7-view-the-list-of-incoming-hackathons)

  1. The participant accesses the hackathon list screen
  2. The participant clicks the "Join hackathon" button of the hackathon he/she wants to join
  3. The participant fills the joining form
  4. The participant is prompted to [explore seed collections](#us-4-explore-sciart-products-collections)

#### US-3D: Join to closest hackathon from home screen

  1. The participant clicks the "Join hackathon" button in the Home screen
  2. The participant fills the joining form
  3. The participant is prompted to [explore seed collections](#us-4-explore-sciart-products-collections)

#### US-3E: Join to some hackathon from its seed collection

  1. The participant accesses some seed collection
  2. The participant clicks the "Join hackathon" button. Shown if there is an incoming hackathon using that collection
  3. The participant fills the joining form
  4. The participant is prompted to [explore seed collections](#us-4-explore-sciart-products-collections)

### US-4: Explore SciArt products collections

As a user, I want to explore seed, flower, and fruit collections, in order to discover more about the SciArt process and products.

This user story has several possible user workflows.

By default, the collection of the most recent edition is shown. The user may change the collection by clicking the dropdown in the collection screen.

#### US-4A: Access product collections from Navbar

1. The user clicks the "Collections" button in the Navbar
2. The user selects the product he/she wants to explore (seeds, flowers or fruits)
3. The user is redirected to the collection screen of the selected product

#### US-4B: Access seed collections from the Home screen

1. The user clicks the logo of the incoming/ongoing edition in the Home screen carousel
2. The user is redirected to the seed collection of that edition

#### US-4C: Access product collections from the edition details screen

1. The user accesses the details screen of some edition
2. The user clicks the product he/she wants to explore (seeds, flowers or fruits)
3. The user is redirected to the collection screen of the selected product

#### US-4D: Access product collections from [Joining a hackathon](#us-3-joining-a-hackathon)

1. The user clicks the "Seed collection" button shown after joining a hackathon
2. The user is redirected to the seed collection of the edition of that hackathon

#### US-4E: Access product collections from other collections

If the user is on some collection screen, he/she can navigate between seed, flower and fruit collection screens.

#### US-4F: Access seed collections from [my liked seeds](#us-15-see-my-liked-seeds-of-some-collection)

1. The participant accesses the liked seeds screen of some edition that has no liked seeds yet
2. The participant clicks the "Seed collection" button
3. The participant is redirected to the seed collection screen of that edition

### US-5: Explore SciArt products details

As a user, I want to explore the details of seed, flower, and fruit collections, in order to discover more about a specific product or topic.

This user story has several possible user workflows.

#### US-5A: Access product details from other collections

 1. The user accesses some product collection
 2. The user clicks the "See more" button of the specific product of which he/she wants to see the details
 3. The user is redirected to the details screen of the selected product

#### US-5B: Access associated seed or flower details of some fruit from its details

 1. The user accesses the details screen of some fruit
 2. The user clicks the button to see the associated seed or flower
 3. The user is redirected to the details screen of the selected product

#### US-5C: Access fruit details from the carousel in the [edition details](#us-12-view-the-details-of-some-previous-edition) screen

 1. The user accesses the details screen of some edition
 2. The user clicks the "Know more" button in the fruits carousel
 3. The user is redirected to the details screen of the selected fruit

#### US-5D: Access seed details from the carousel shown after [joining a hackathon](#us-3-joining-a-hackathon)

 1. The user clicks the "Know more" button in the seeds carousel
 2. The user is redirected to the details screen of the selected seed

### US-6: View detailed information about the methodology format

As a user, I want to see the methodology format, in order to understand how it's structured.

This user story has several possible entry points:

1. Entry point:
    * From the "Our format" button in the Navbar
    * From the "Find all the details here" button in the Home screen
    * From [Joining a hackathon - From Registering](#us-3-joining-a-hackathon)
2. The user is redirected to the methodology format details screen after clicking the corresponding button.

### US-7: View the list of incoming hackathons

As a user, I want to see all the incoming hackathons, in order to decide if I will join one or not.

This user story has several possible entry points:

1. Entry point:
   * From the Navbar
   * From [Registering](#us-2-registering)
   * From the [Methodology format](#us-6-view-detailed-information-about-the-methodology-format) screen
2. The user is redirected to the hackathons screen. The list will appear in the "Next hackathons" section.

### US-8: View the hackathons in which I am enrolled

As a participant, I want to see the hackathons in which I am enrolled, in order to organise my schedule so that I can attend.

This user story has the same user workflow as [US-7](#us-7-view-the-list-of-incoming-hackathons), but the user must be authenticated.

### US-9: View past hackathons in which I participated

As a participant, I want to see past hackathons in which I participated, in order to remember my previous experiences in SciArt.

This user story has the same user workflow as [US-7](#us-7-view-the-list-of-incoming-hackathons), but the user must be authenticated.

The list will appear in the "Your past hackathons" section.

### US-10: View my creations in a hackathon in which I participated

As a participant, I want to see my creations in a hackathon in which I participated, in order to remember the SciArt process I followed and its results.

1. The participant accesses the "Hackathons" screen
2. The participant clicks the "Your contributions" button in some past hackathon
3. The participant is redirected to the creations screen

### US-11: View the list of previous editions

As a user, I want to see a list of previous SciArt methodologies editions, in order to check the different topics and a short description of what was covered in previous projects.

1. The user clicks the "Editions" button in the Navbar
2. The user is redirected to the editions screen
3. The list of previous editions is shown

### US-12: View the details of some previous edition

As a user, I want to see the details of some previous edition, in order to get inspired by past projects and get more information about the SciArt process

1. The user enters the [editions screen](#us-11-view-the-list-of-previous-editions)
2. The user clicks the "Know more" button of some edition
3. The user is shown a description of the edition, a link to the catalog, a fruit carousel and links to its collections

### US-13: Access hackathon main screen

As a participant, I want to enter a hackathon in which I am enrolled, in order to participate in it.

1. The participant enters AppSciArt manually, or from the confirmation email received
2. The participant clicks the joining button in the Home screen
3. A new tab is opened with the Hackathon screen

### US-14: Like a seed

As a participant, I want to be able to like seeds, in order to have a separate collection of all my favourite seeds and review them later on.

This user story has different user workflows.

#### US-14A: From some [seed collection](#us-4-explore-sciart-products-collections)

1. The participant enters some [seed collection screen](#us-4-explore-sciart-products-collections)
2. The participant clicks the like button of the seed he/she likes

#### US-14B: From [seed details](#us-5-explore-sciart-products-details)

1. The participant enters the [seed details screen](#us-5-explore-sciart-products-details)
2. The participant clicks the like button shown in the screen

### US-15: See my liked seeds of some collection

As a participant, I want to see my liked seeds, in order to see those seeds I liked the most again and get more information about them.

1. The participant clicks the "My liked seeds" button in the Navbar
2. The participant is redirected to the liked seeds screen
3. The list of liked seeds of the most recent collection is shown by default.
4. If there are no liked seeds, the participant is prompted to [explore seed collections](#us-4-explore-sciart-products-collections)

If the participant wants to change the collection shown, he/she can click the dropdown show on the screen and select the preferred collection.

### US-16: Unlike a seed

As a participant, I want to be able to unlike seeds, in order keep my favourites list up to date and only include seeds I’m still interested in.

This user story has different user workflows.

#### US-16A: From [seed collection](#us-4-explore-sciart-products-collections)

1. The participant accesses the seed collection screen of some edition
2. The participant clicks the unlike button of the seed he/she does not like anymore

#### US-16B: From [seed details](#us-5-explore-sciart-products-details)

1. The participant accesses the details screen of some seed
2. The participant clicks the unlike button

#### US-16C: From [my liked seeds](#us-14-like-a-seed)

1. The participant accesses the liked seeds screen of some collection
2. The participant clicks the unlike button of the seed he/she does not like anymore

### US-17: Enter my exploring group

As a participant, I want to enter my assigned exploring group, in order to collaborate in creating a conceptual map of the seed of my group.

1. The participant clicks the "Enter exploring groups" button, shown after the Facilitators have created exploring groups
2. The participant is redirected to the Exploring group screen

### US-18: Explore seed associated to my exploring group

As a participant, I want to explore the seed assigned to my exploring group, in order to get more information and create a conceptual map of it.

1. The participant [enters the exploring group screen](#us-12-enter-my-exploring-group)
2. The seed PDF and links to its resources are shown in the screen
3. The participant navigates over the provided information

### US-19: Collaboratively create a conceptual map of the seed assigned to my exploring group

As a participant, I want to collaboratively create a conceptual map of the seed assigned to my exploring group, so that other groups can get an initial understanding of all seeds.

1. The participant [enters the exploring group screen](#us-12-enter-my-exploring-group)
2. The collaborative conceptual map creator is shown in the screen
3. The participant introduces shapes, text, or images

### US-20: Ask an AI agent about the seed associated to my exploring group

As a participant, I want to ask an AI agent about the seed associated to my exploring group or any other related topic, in order to get a clearer picture of it and get more information.

1. The participant [enters the exploring group screen](#us-12-enter-my-exploring-group)
2. The AI chat is shown in the screen
3. The participant enters a prompt
4. The AI chat responds to it

### US-21: Ask for help to a facilitator

As a participant (group voice), I want to ask for help to a facilitator, in order to solve doubts about the process or solve any issue that has emerged during it.

1. The participant [enters the exploring group screen](#us-12-enter-my-exploring-group)
2. The assistance chat is shown in the screen
3. The participant chats with the facilitators

### US-22: Submit the conceptual map created by my group

As a participant (group voice), I want to submit the conceptual map created by my group, in order to deliver it to facilitators and present it to other participants.

1. The participant [enters the exploring group screen](#us-12-enter-my-exploring-group)
2. The participant clicks the "Send conceptual map" button when it is finished
3. The participant confirms the submission
4. If there is still time left for other participants to finish their conceptual maps, participants of the group are redirected to a waiting screen while waiting for other groups to finish
5. If there is not, the participants are redirected to the conceptual maps presentation screen

### US-23: Present the conceptual map created by my exploring group

As a participant (usually, the group voice), I want to present the conceptual map created by my exploring group, in order to give other participants an initial understanding of our assigned seed.

1. The participant enters the "Conceptual map" section in the conceptual maps presentation screen
2. When the turn arrives, the conceptual map of the group will be shown in this section
3. The participant shares his/her screen, if necessary
4. The participant presents the conceptual map of his/her exploring group

### US-24: Rate seeds

As a participant, I want to rate each seed presented, in order to help facilitators creating co-creation teams.

1. The participant enters the "Ratings" section in the conceptual maps presentation screen
2. The participant clicks the rating he/she wants to assign to each seed
3. After all the presentations are finished, the participant reviews and confirms his/her ratings
4. The participant clicks the "Submit my ratings" button
5. The participant is redirected to a waiting screen (until co-creation teams are created)

### US-25: Enter my co-creation team

As a participant, I want to enter my assigned co-creation team, in order to collaborate in creating an artistic proposal based on some seed that I liked.

1. The participant clicks the "Enter co-creation team" button, shown after the Facilitators have created co-creation teams
2. The participant is redirected to the Co-creation team screen

### US-26: Access the information about the seed associated to my co-creation team

As a participant, I want to have access to the information about my team's seed, in order to think about different possible artistic proposals.

1. The participant [enters the co-creation team screen](#us-20-enter-my-co-creation-team)
2. The seed PDF, conceptual map, and other resources are shown in the screen
3. The participant navigates over the provided information

### US-27: Collaboratively fill the flower template

As a participant, I want to collaboratively fill the flower template, in order to formally redact the artistic proposal that the team has thought about.

1. The participant [enters the co-creation team screen](#us-20-enter-my-co-creation-team)
2. The editable flower template is shown in the screen
3. The participant writes in it, together with other team members

### US-28: Submit flower deliverables and template

As a participant (speaker), I want to submit the completed flower template and other items, in order to deliver our proposal to the facilitators. 

1. The participant [enters the co-creation team screen](#us-20-enter-my-co-creation-team)
2. The participant clicks the "Deliver flower" button when it is finished and all items are attached
3. The participant confirms the submission

TODO: COVER NOTIFICATIONS/REMIDERS