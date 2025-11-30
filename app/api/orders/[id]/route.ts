import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET single order - can fetch by id or orderNumber
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the param looks like an orderNumber (starts with ORD-) or an ObjectId
    const isOrderNumber = params.id.startsWith("ORD-");
    
    let order;
    if (isOrderNumber) {
      // Search by orderNumber
      order = await prisma.order.findFirst({
        where: {
          orderNumber: params.id,
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });
    } else {
      // Search by ID (ObjectId)
      order = await prisma.order.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, paymentStatus, trackingNumber } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if order exists and belongs to user or user is admin
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        ...(user.role !== "admin" && { userId: user.id }),
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(trackingNumber && { trackingNumber }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
