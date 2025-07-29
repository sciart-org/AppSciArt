import { Edition } from '../../src/models/Edition.js'

const baseEdition = {
  id: null,
  name: null,
  logo: null,
  year: null,
  shortDescription: null,
  longDescription: null,
  catalogLink: null,
  isVisible: true
}

export async function seedEditions () {
  await Edition.bulkCreate([
    {
      ...baseEdition,
      id: '00000000-0000-0003-0000-000000000000',
      name: 'ASTER+S > ART ^ ENVIRONMENT & AI',
      logo: 'https://drive.google.com/thumbnail?id=1nntzSuxqmzgW6-DCsHyp1FgqWpZH_MHX&sz=s4000',
      year: 2023
    },
    {
      ...baseEdition,
      id: '00000000-0000-0003-0000-000000000001',
      name: 'ASTER+S > ART ^ SEALIFE',
      logo: 'https://drive.google.com/thumbnail?id=1csVlBreYkkey1NkDyxE0VnWZJToG7geP&sz=s4000',
      year: 2024,
      shortDescription: `In collaboration with the Institute of Marine Sciences (CSIC, Barcelona)

How can citizens contribute to better understanding and caring for our marine ecosystems affected by the Anthropocene?

Find it in this edition`,
      longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      isVisible: true
    },
    {
      ...baseEdition,
      id: '00000000-0000-0003-0000-000000000002',
      name: 'ASTER+S > ART ^ NEUROSCIENCE',
      logo: 'https://drive.google.com/thumbnail?id=1_DUOT1fdH2Osrnfx7Ua5-YMLaswmBGwh&sz=s4000',
      year: 2025,
      shortDescription: `In collaboration with the Institute of Marine Sciences (CSIC, Barcelona)

How can citizens contribute to better understanding and caring for our marine ecosystems affected by the Anthropocene?

Find it in this edition`,
      longDescription: `In a world strained by environmental, technological, and political crises, the ASTER+S project emerges as an urgent gesture of recomposition, an act of listening across disciplines, a transdisciplinary creative osmosis. Here, art and neuroscience do not merely illustrate one another; they fertilize and expand.

We live at a moment when the boundaries of knowledge are dissolving. As Catherine Malabou suggests, thinking the brain is thinking plasticity: not just as an adaptive capacity, but as a power of transformation. In this exhibition, cerebral plasticity becomes aesthetic plasticity. The works germinate from inspirational neuroscientific seeds (from basic research to medicine and psychobiology), and blossom into aesthetic proposals co-created by interdisciplinary teams, yielding sensitive devices that shape new ways of thinking, feeling, and imagining.

Neuroscience, Francisco Varela argued, must abandon its “objectivist pretension” and open itself to the enacted, the lived, the embodied. ASTER+S incarnates that possibility: from installations that materialize the emotional pulses of the sympathetic system to performances that translate cellular trauma into movement. Each piece is an experiment (technical and experiential alike), an exercise in cognitive empathy.

Yet beyond sensory wonder, this exhibition advances a critical poetics. In an age of generative algorithms and neoliberal post- humanism, the question is no longer only what we can know about the brain, but what kind of humanity we wish to build from that knowledge. As Donna Haraway reminds us, “we are made not only of atoms but of stories.” This show tells many: stories of bodies quivering on neuro-harmony, of memories unraveling into liquid recollections, of identities sculpted by electric impulses... Since Santiago Ramón y Cajal, who likened neurons to “stars in the firmament,” we have known that studying the brain is also a poetic enterprise. ASTER+S rekindles that visionary impulse: it imagines connectomes as symbolic constellations, synaesthesias as windows onto being, circuits as pathways toward mental care. It reminds us that each neuronal spark is also a political act, a possibility of relation, an open question.

Science alone cannot imagine more habitable worlds; art alone cannot transform the material conditions of existence. But when they intertwine, as they do here, a form of knowledge arises that refuses to separate reason from emotion, data from metaphor. What emerges is a tactile, sonorous, embodied thought that seeks not only to understand the world, but to feel it differently.

The ASTER+S experience, and the works it gathers, stand as testimony to that pursuit. They are not mere documentary records; they are invitations to cross thresholds: from left to right hemisphere, from data to gesture, from standardized cognition to disruptive, transformative imagination... and back again. May participatory experiences and exhibitions like this awaken our curiosity, care, and respect for art and science as complementary languages with which to inhabit a more conscious present and a more humane future.`
    }
  ])
}
