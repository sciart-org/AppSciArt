import { Fruit } from '../../src/models/Fruit.js'

const baseFruit = {
  id: null,
  title: null,
  mainImage: 'https://i.imgur.com/e43XwwH.png',
  state: 'IN_BLANK',
  authorVision: null,
  curatorVision: null,
  driveLink: null,
  flowerId: null
}

export async function seedFruits () {
  await Fruit.bulkCreate([
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000000',
      title: 'Boya Kduino fruit 1-1',
      flowerId: '00000000-0000-0007-0000-000000000004',
      curatorVision: `"Neural Latency" invites viewers into a meditative exploration of the threshold between life and death, perception and absence.
This immersive installation takes as its conceptual foundation the clinical and existential implications of brain death and organ donation—moments in which the body may appear intact, yet consciousness has irreversibly ceased. At its center is a deep black circle, evocative of a dilated pupil or a void, suspended above the viewer. When gazed upon, it activates: neural-like fibers radiate outward in delicate, luminous motion, mimicking the firing of synapses or the final flickers of neural activity.

This installation probes fundamental questions: Where does consciousness reside? Can identity persist without perception? The work does not provide answers, but rather asks the viewer to sit with uncertainty, drawing attention to the fragile, mysterious nature of conscious awareness. It is both elegy and inquiry—a poetic contemplation of the nervous system at the edge of being.`,
      authorVision: `Brain death can be certified by different clinical tests. One of these is the photomotor reflex; when light is applied to the patient's pupil, if it does not react, total cessation of encephalic activity is confirmed; i.e., death. However, in some cases, the body can be kept artificially functioning for a limited period of time, in order to preserve its organs for possible donation. The body ceases to be a receptacle of life and consciousness, then persists temporarily as a functional mechanical system, subject to an induced rhythm until, inevitably, it collapses.

The installation transfigures these medical protocols into a visual metaphor. A black eye suspended in space as a mute and absolute presence, becomes the epicenter of a system that was once alive. Its opaque and perfectly rounded surface evokes a pupil in a permanent state of dilation; no reflex, no reaction. From this hieratic core emanate fiber optic cables that radiate in space with an incessant but calm luminous cadence, which seems to emulate last impulses to a consciousness that no longer responds, like a silent echo.

Therefore, under the spectator's gaze, who witnesses a ritual scene doomed to the inevitable, the installation questions the notion of threshold itself; not only between life and death, but also between biological and artificial, the attempt to persist and an unavoidable sentence. A hanging metaphor of death, conceived not only as an end point but as an irreversible process.`,
      seedDescription: `Brain death involves the complete and irreversible cessation of the functions of both cerebral hemispheres and the brainstem.

In contrast to vegetative or comatose states, where some areas of the brain may remain functional, in brain death brain activity disappears completely, resulting in the de facto death of the patient.`
    },
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000001',
      title: 'Boya Kduino fruit 1-2',
      state: 'IN_PROGRESS',
      flowerId: '00000000-0000-0007-0000-000000000004'
    },
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000002',
      title: 'Boya Kduino fruit 2-1',
      state: 'IN_REVIEW',
      flowerId: '00000000-0000-0007-0000-000000000005'
    },
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000003',
      title: 'Boya Kduino fruit 2-2',
      state: 'PUBLISHED',
      flowerId: '00000000-0000-0007-0000-000000000005'
    }
  ])
}
