//const { describe, it } = require("mocha");
const assert = require("assert");
const { getDataFromCP } = require("./geoHandler");

describe(__filename, () => {
  it("Doit retourner les informations de découpage d'un code postal", async () => {
    assert.deepStrictEqual(await getDataFromCP("92600"), {
      result: {
        code_postal: "92600",
        code_commune_insee: "92004",
        commune: "ASNIERES-SUR-SEINE",
        num_departement: "92",
        nom_departement: "HAUTS-DE-SEINE",
        region: "ILE-DE-FRANCE",
        nom_academie: "Versailles",
        num_academie: 25,
      },
      messages: { cp: "Ok", nom_academie: "Ok", num_academie: "Ok" },
    });
  });
  it("Doit retourner les erreurs avec un code postal erroné", async () => {
    assert.deepStrictEqual(await getDataFromCP("aswe23"), {
      result: {},
      messages: {
        error: "Erreur: Le code postal fourni doit être définit et au format 5 caractères aswe23",
      },
    });
  });

  it("Doit retourner les erreurs avec un code postal introuvable", async () => {
    assert.deepStrictEqual(await getDataFromCP("89900"), {
      result: {},
      messages: {
        error: "Erreur: Le code postal fourni est introuvable 89900",
      },
    });
  });

  it("Doit retourner les informations de découpage lorsqu'un Code insse est fourni", async () => {
    assert.deepStrictEqual(await getDataFromCP("92004"), {
      result: {
        code_postal: "92600",
        code_commune_insee: "92004",
        commune: "ASNIERES-SUR-SEINE",
        num_departement: "92",
        nom_departement: "HAUTS-DE-SEINE",
        region: "ILE-DE-FRANCE",
        nom_academie: "Versailles",
        num_academie: 25,
      },
      messages: {
        cp: "Le code 92004 est un code commune insee",
        nom_academie: "Ok",
        num_academie: "Ok",
      },
    });
  });
});
