'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('editions', [
    {
      id: Sequelize.literal('gen_random_uuid()'),
      name: 'ASTER+S > ENVIRONMENT & AI',
      year: 2023,
      driveLink: 'https://drive.google.com/drive/folders/1KEs9C9GBUsjnDHFrGai8AZH80eGNVx2j',
      catalogLink: 'https://aster.us.es/alleditions/wp-content/uploads/2025/05/CATALOG_ASTER23_ARS.pdf',
      shortDescription: 'Exploring the intersection of environmental challenges and artificial intelligence through interdisciplinary SciArt collaboration, establishing new ways to combine artistic and scientific knowledge.',
      longDescription: `ASTER 2023 marks the first edition of the ASTER project, introducing a pioneering framework for collaboration between artistic and scientific practices. The edition is centered on the intersection between environmental challenges and artificial intelligence, exploring how emerging technologies can be used not only to analyse ecological systems, but also to reinterpret, question, and reimagine them through artistic creation.

At its core, ASTER 2023 proposes a shift from traditional disciplinary boundaries toward a hybrid model of knowledge production. Artists and scientists work together in interdisciplinary teams, engaging in processes of co-creation that blur the limits between research, experimentation, and artistic expression. This approach is not merely illustrative; it seeks to generate new forms of understanding by combining scientific data, computational models, and sensory experiences.

Artificial intelligence plays a central role in this edition, functioning both as a tool and as a conceptual framework. It is used to process environmental data, simulate natural phenomena, and generate new visual, auditory, and interactive narratives. At the same time, the project critically reflects on the implications of AI in ecological contexts, addressing questions related to authorship, agency, and the ethics of technological mediation in our relationship with the natural world.

The environmental dimension of ASTER 2023 focuses on the complexity of ecosystems and the urgent need to rethink human interaction with the planet. Through artistic interpretations of climate data, biodiversity, and ecological processes, the participating teams explore alternative ways of perceiving and engaging with environmental issues. The artworks produced in this context do not aim to provide definitive answers, but rather to open spaces for reflection, emotional engagement, and collective awareness.

A key contribution of this first edition is the development of the ASTER methodology, a structured yet flexible framework that guides interdisciplinary collaboration. This methodology emphasizes dialogue, iterative experimentation, and the translation of scientific concepts into artistic forms. It also highlights the importance of process over outcome, valuing the exploratory nature of collaboration as much as the final works produced.

The results of ASTER 2023 materialize in a series of installations, prototypes, and artistic projects that embody the fusion of science and art. These works invite audiences to experience environmental data and artificial intelligence not as abstract concepts, but as immersive and tangible realities. By engaging the senses and emotions, the exhibition encourages a deeper understanding of the complex relationships between technology, ecology, and human perception.

In addition to its exhibitions, the edition contributes to an expanding international dialogue on SciArt practices. Through collaborations, public presentations, and participation in cultural and scientific events, ASTER 2023 positions itself within a broader network of initiatives that seek to redefine how knowledge is produced and shared in the 21st century.

Ultimately, ASTER 2023 establishes the conceptual and methodological foundations for future editions of the project. It demonstrates the potential of interdisciplinary collaboration to address complex global challenges, and proposes a new paradigm in which art and science are not separate domains, but interconnected practices that together can generate meaningful insights and transformative experiences.`,
      state: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: Sequelize.literal('gen_random_uuid()'),
      name: 'ASTER+S > SEALIFE',
      year: 2024,
      driveLink: 'https://drive.google.com/drive/folders/12riWTse7StDAGs5g44EaZ0V1xBoPNLqM',
      catalogLink: 'https://aster.us.es/alleditions/wp-content/uploads/2025/08/CATALOGUE_ASTERS_24_SEALIFE_ONLINE.pdf',
      shortDescription: 'Investigating marine ecosystems through international SciArt collaboration, focusing on biodiversity, ocean processes, and human impact via immersive artistic and scientific projects.',
      longDescription: `ASTER 2024, under the theme "Sealife", represents the consolidation and international expansion of the ASTER project, building upon the methodological foundations established in its first edition. This second iteration shifts its focus toward marine ecosystems, exploring the oceans as complex, dynamic, and often invisible environments that are crucial to the balance of life on Earth.

The Sealife edition brings together artists, scientists, and researchers from diverse disciplines to collaboratively investigate the ecological, biological, and cultural dimensions of marine environments. Through the ASTER methodology, interdisciplinary teams engage in processes of co-creation that combine scientific knowledge with artistic exploration, generating new ways of understanding and experiencing the ocean.

At the center of this edition is the recognition of the ocean as both a scientific frontier and a space of imagination. Marine ecosystems, ranging from microscopic plankton communities to large-scale oceanic processes, are approached not only through data and analysis, but also through sensory, visual, and immersive interpretations. This dual perspective allows participants to translate complex scientific phenomena into accessible and emotionally resonant artistic forms.

The projects developed during ASTER 2024 address a wide range of topics related to marine life, including biodiversity, climate change, pollution, and the impact of human activity on ocean systems. By engaging with these issues, the edition seeks to raise awareness of the fragility and importance of marine ecosystems, while also fostering a deeper connection between audiences and the natural world.

A defining feature of the Sealife edition is its international dimension. The project extends beyond a single location, with activities, collaborations, and exhibitions taking place across multiple cities and institutions. This distributed format reinforces the global relevance of the themes addressed and enables the creation of a network of exchange between different cultural and scientific contexts.

The resulting artworks take the form of installations, audiovisual pieces, interactive experiences, and experimental prototypes that invite audiences to immerse themselves in the underwater world. These works often incorporate scientific data, digital technologies, and real-time processes, creating environments that blur the boundaries between observation, participation, and reflection.

In addition to its artistic outcomes, ASTER 2024 continues to refine and expand the ASTER methodology. The collaborative processes developed during this edition emphasize adaptability, transdisciplinarity, and the integration of diverse forms of knowledge. The methodology evolves as a living framework, shaped by the experiences and contributions of each participating team.

The Sealife edition also highlights the importance of communication and public engagement. By translating scientific research into artistic experiences, the project opens new channels for dialogue between experts and broader audiences. This approach not only enhances the visibility of scientific knowledge but also encourages critical thinking and collective responsibility in relation to environmental challenges.

Ultimately, ASTER 2024 positions the ocean as a central subject for both scientific inquiry and artistic exploration. It demonstrates how interdisciplinary collaboration can reveal hidden dimensions of marine ecosystems and inspire new perspectives on our relationship with the planet. As the project continues to grow, the Sealife edition stands as a key step in the evolution of ASTER, reinforcing its commitment to connecting art, science, and society on a global scale.`,
      state: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: Sequelize.literal('gen_random_uuid()'),
      name: 'ASTER+S > NEUROSCIENCE',
      year: 2025,
      driveLink: 'https://drive.google.com/drive/folders/1AdEMkK7YXptYwbLv2vfpDnE7jMSdIma0',
      catalogLink: 'https://aster.us.es/alleditions/wp-content/uploads/2025/08/CATALOGO-ASTER-25-NEUROSCIENCE-ONLINE.pdf',
      shortDescription: 'Delving into neuroscience, cognition, and perception by combining artistic creativity and scientific research in interactive and immersive SciArt experiences.',
      longDescription: `ASTER 2025, themed “Neuroscience”, represents the third edition of the ASTER project and continues its exploration of interdisciplinary collaboration between the arts and sciences. Building upon the methodologies and frameworks established in previous editions, ASTER 2025 turns its focus toward the human brain, cognition, perception, and the embodied experience, aiming to translate complex neuroscientific research into immersive artistic experiences.

The edition gathers artists, neuroscientists, psychologists, and other researchers to co-create projects that bridge scientific knowledge with creative expression. Teams engage in collaborative processes that encourage experimentation, dialogue, and iterative development, applying the ASTER methodology to explore how cognitive processes can be represented and interpreted through artistic media.

Central to ASTER 2025 is the investigation of perception, memory, and emotional response. Participating teams examine how the brain processes sensory input and interprets complex information, and how artistic interventions can influence or illuminate these processes. Through interactive installations, audiovisual works, and immersive environments, the edition allows audiences to experience cognitive phenomena in ways that are both intuitive and scientifically informed.

Neuroscience in this edition is not treated as abstract theory alone; rather, it is integrated into artistic processes that highlight the relationship between brain function, bodily experience, and environmental stimuli. Projects explore topics such as neuroplasticity, attention, consciousness, the effects of technology on cognition, and the intersections of mental health and creativity. By making scientific concepts tangible, ASTER 2025 fosters a deeper understanding of how humans interact with information, space, and each other.

The edition also emphasizes experimentation with emerging technologies and data-driven methods. Brain-computer interfaces, biofeedback, neuroimaging data, and AI-assisted analysis are employed as tools for generating artistic outputs, creating works that are simultaneously grounded in research and evocative in their aesthetic impact. These approaches enable artists and scientists to investigate the limits of human perception and cognition while engaging audiences in thought-provoking experiences.

A key outcome of ASTER 2025 is the development of artworks that act as cognitive laboratories, inviting viewers to participate actively and reflect on their own mental processes. By situating the audience within interactive and responsive environments, the edition challenges traditional notions of spectatorship and encourages a form of embodied understanding where art and science converge.

The edition also fosters knowledge exchange at a global level, connecting local research groups with international collaborators. Through workshops, presentations, and public exhibitions, ASTER 2025 strengthens networks between artistic and scientific communities, encouraging long-term interdisciplinary partnerships.

Finally, ASTER 2025 consolidates the ASTER methodology as a robust, flexible framework for SciArt co-creation. It demonstrates the potential of art-science collaboration to translate complex scientific ideas into experiences that are comprehensible, meaningful, and emotionally resonant. The Neuroscience edition showcases how interdisciplinary collaboration can reveal unseen dimensions of human cognition, provoke new questions about perception, and inspire both scientific inquiry and artistic innovation. Through this work, ASTER continues to establish itself as a platform where creativity, science, and society intersect in transformative ways.`,
      state: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: Sequelize.literal('gen_random_uuid()'),
      name: 'ASTER+S > GENETICS',
      year: 2026,
      driveLink: 'https://drive.google.com/drive/folders/1HnYFPeNnBnoqnm2kjPBjqFIbembFqpN7',
      catalogLink: null,
      shortDescription: 'Focusing on genetics and molecular biology, this edition brings together artists and scientists to co-create projects exploring life sciences concepts and ethical dimensions.',
      longDescription: null,
      state: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('editions', {
    name: [
      'ASTER+S > ENVIRONMENT & AI',
      'ASTER+S > SEALIFE',
      'ASTER+S > NEUROSCIENCE'
    ]
  }, {})
}
