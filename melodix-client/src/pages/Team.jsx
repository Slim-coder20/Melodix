import HorizontalMenu from "@/components/HorizontalMenu";

export default function Equipe() {
  const teamData = [
    {
      category: "DIRECTION",
      members: [
        {
          name: "Joseph Gonzalez",
          description: "Responsable de la direction générale",
          image: "joseph-gonzalez-direction.jpg",
        },
      ],
    },
    {
      category: "ACHAT ET OFFRE",
      members: [
        {
          name: "Charles Etoroma",
          description: "Responsable des achats",
          image: "charles-etoroma.jpg",
        },
        {
          name: "Florence Pesher",
          description: "Responsable de l'offre",
          image: "Florence Pesher.jpg",
        },
        {
          name: "Ian Dooley",
          description: "Approvisionneur",
          image: "ian-dooley.jpg",
        },
        {
          name: "Michael Dam",
          description: "Chef de produit",
          image: "michael-dam.jpg",
        },
      ],
    },
    {
      category: "MARKETING ET DIGITAL ",
      members: [
        {
          name: "Léa Molina",
          description: "Graphiste",
          image: "Lea-Molina.jpg",
        },
        {
          name: "Robert Melzer",
          description: "UI/UX designer",
          image: "Robert-Melzer.jpg",
        },
        {
          name: "Antonin Dubois",
          description: "Développeur",
          image: "Antonin-Dubois.jpg",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Menu de navigation  */}
      <HorizontalMenu />
      <h1 className=" text-center text-5xl text-blue-900 mb-8 mt-2">
        L'ÉQUIPE
      </h1>
      <div className=" space-y-2 ml-10 mb-5">
        {teamData.map((category) => (
          <div key={category.category}>
            <h2 className="text-3xl text-blue-700  mb-6 ">
              {category.category}
            </h2>
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.members.map((member) => (
                <div
                  key={member.name}
                  className=" flex flex-col items-center text-center"
                >
                  <img
                    src={`/teams/${member.image}`}
                    alt={member.name}
                    className="w-50 h-50 rounded-4xl object-cover mb-4 shadow-2xs"
                  />
                  <h3 className=" text-xl font-bold">{member.name}</h3>
                  <p className="text-blue-600">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
