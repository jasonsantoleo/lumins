try {
    require('.prisma/client/default');
    console.log("Success: Found .prisma/client/default");
} catch (e) {
    console.error("Error:", e);
}

try {
    const { PrismaClient } = require('@prisma/client');
    console.log("Success: Found @prisma/client");
    new PrismaClient();
    console.log("Success: Instantiated PrismaClient");
} catch (e) {
    console.error("Error with @prisma/client:", e);
}
